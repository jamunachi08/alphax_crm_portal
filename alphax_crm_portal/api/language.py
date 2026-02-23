import frappe

@frappe.whitelist()
def set_user_language(lang: str):
    """Set current user's language ONLY (does not affect other users)."""
    if not lang:
        frappe.throw("Language is required")

    lang = (lang or "").strip().lower()
    if lang not in ("ar", "en"):
        frappe.throw("Unsupported language")

    user = frappe.session.user
    if user == "Guest":
        frappe.throw("Not permitted")

    frappe.db.set_value("User", user, "language", lang)
    frappe.db.commit()
    frappe.local.lang = lang
    return {"ok": True, "lang": lang}
