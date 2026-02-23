\
/* global frappe */
frappe.pages["alphax-crm"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({ parent: wrapper, title: __("AlphaX CRM"), single_column: true });

  const CONFIG = {
    title: { ar: "إدارة علاقات العملاء", en: "Customer Relationship Management" },
    sections: [
      { title:{ar:"تقارير هامة", en:"Important Reports"}, tiles:[
        { icon:"time", label:{ar:"تحليلات مدة المكالمات", en:"Call Duration Analytics"}, open:{type:"list", doctype:"Communication"} },
        { icon:"call", label:{ar:"المتصلات", en:"Calls"}, open:{type:"list", doctype:"Communication"} },
        { icon:"chart", label:{ar:"فلتر التقارير", en:"Report Filters"}, open:{type:"page", page:"query-report"} },
        { icon:"customer", label:{ar:"عملاء", en:"Customers"}, open:{type:"list", doctype:"Customer"} }
      ]},
      { title:{ar:"تسويق", en:"Marketing"}, tiles:[
        { icon:"users", label:{ar:"العملاء المستهدفين", en:"Target Customers"}, open:{type:"list", doctype:"Lead"} },
        { icon:"help", label:{ar:"خدمة العملاء", en:"Customer Service"}, open:{type:"list", doctype:"Issue"} }
      ]},
      { title:{ar:"مبيعات", en:"Sales"}, tiles:[
        { icon:"calendar", label:{ar:"الزيارات المجدولة", en:"Scheduled Visits"}, open:{type:"list", doctype:"Event"} },
        { icon:"tick", label:{ar:"إجراءات المبيعات", en:"Sales Actions"}, open:{type:"list", doctype:"ToDo"} }
      ]}
    ]
  };

  const LANG_KEY = "alphax_crm_lang";
  const icon = (name) => frappe.utils.icon(name || "folder", "md");
  const get_lang = () => {
    const stored = localStorage.getItem(LANG_KEY);
    const user_lang = frappe.boot?.user?.language || "ar";
    const lang = (stored || user_lang || "ar").toLowerCase();
    return lang.startsWith("ar") ? "ar" : "en";
  };
  const t = (obj) => (obj && obj[get_lang()]) || (obj && obj.en) || "";
  const safe = (obj) => frappe.utils.escape_html(JSON.stringify(obj || {}));

  const open_target = (open) => {
    if (!open) return;
    frappe.route_options = open.route_options || null;
    if (open.type === "list") return frappe.set_route("List", open.doctype);
    if (open.type === "page") return frappe.set_route(open.page);
    if (open.type === "route" && Array.isArray(open.route)) return frappe.set_route(...open.route);
    if (open.type === "report") return frappe.set_route("query-report", open.report);
  };

  const set_user_ui_language = async (lang) =>
    frappe.call({ method:"alphax_crm_portal.api.language.set_user_language", args:{lang} });

  const render = () => {
    const lang = get_lang();
    const dir = lang === "ar" ? "rtl" : "ltr";
    page.set_title(t(CONFIG.title));

    const sections_html = CONFIG.sections.map(sec => {
      const tiles_html = (sec.tiles || []).map(tile => `
        <div class="alphax-tile" data-open='${safe(tile.open)}'>
          <div class="alphax-tile-ico">${icon(tile.icon)}</div>
          <div class="alphax-tile-label">${frappe.utils.escape_html(t(tile.label))}</div>
        </div>`).join("");
      return `
        <div class="alphax-section">
          <div class="alphax-section-head">
            <div class="alphax-section-title">${frappe.utils.escape_html(t(sec.title))}</div>
          </div>
          <div class="alphax-tiles">${tiles_html}</div>
        </div>`;
    }).join("");

    $(page.body).html(`
      <div class="alphax-crm-wrap" dir="${dir}">
        <div class="alphax-topbar">
          <div class="alphax-title">
            <span class="alphax-title-icon">${icon("users")}</span>
            <span>${frappe.utils.escape_html(t(CONFIG.title))}</span>
          </div>
          <div class="alphax-lang-toggle">
            <button class="btn btn-sm ${lang==="ar"?"btn-primary":"btn-default"}" data-lang="ar">العربية</button>
            <button class="btn btn-sm ${lang==="en"?"btn-primary":"btn-default"}" data-lang="en">English</button>
          </div>
        </div>
        ${sections_html}
      </div>
    `);

    $(page.body).find(".alphax-tile").on("click", function () {
      let o = {};
      try { o = JSON.parse($(this).attr("data-open") || "{}"); } catch (e) {}
      open_target(o);
    });

    $(page.body).find("[data-lang]").on("click", async function () {
      const new_lang = $(this).attr("data-lang");
      localStorage.setItem(LANG_KEY, new_lang);
      try { await set_user_ui_language(new_lang); window.location.reload(); }
      catch (e) { frappe.msgprint({ title: __("Language Update Failed"), message: __("Could not change your language."), indicator: "red" }); }
    });
  };

  render();
};
