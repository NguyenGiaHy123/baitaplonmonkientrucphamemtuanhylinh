using DaoTaoTinChiCIT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace DaoTaoTinChiCIT.Controllers
{
    public class AccountsController : Controller
    {
        daotaotinchiEntities db = new daotaotinchiEntities();

        public ActionResult Index()
        {
            if (HttpContext.Session["CurrentLogin"] != null)
            {
                return RedirectToAction("Schedule", "Teacher");
            }
            else
            {
                Session["Pages"] = "Login";
                return View();
            }
        }

        [HttpPost]
        public ActionResult Login(string MaTK, string MatKhau)
        {
            var v = db.web_users.Where(us => us.username.Equals(MaTK) && us.pwd.Equals(MatKhau)).FirstOrDefault();
            if (v != null && v.locked == false)
            {
                string group = v.group_id.ToString();
                string account = v.username.ToString();
                Session["Group"] = group;
                Session["CurrentLogin"] = account;
                Session["CurrentUser"] = v.fullName.ToString();

                if (group.Contains("1"))
                {
                    Session["Pages"] = "Admin";
                    return RedirectToAction("Index", "Admin");
                }
                else if (group.Contains("4"))
                {
                    var vcb = db.hoso_cb.Where(cb => cb.ma.Equals(account)).FirstOrDefault();
                    if (vcb != null)
                    {
                        ViewBag.UserInfo = vcb;
                        Session["Pages"] = "Teacher";
                        return RedirectToAction("Schedule", "Teacher");
                    }
                    else
                    {
                        return RedirectToAction("Login", "Accounts");
                    }
                }
                else
                {
                    var vsv = db.hoso_sv.Where(sv => sv.ma.Equals(account)).FirstOrDefault();
                    if (vsv != null)
                    {
                        var lop = db.lops.Where(l => l.ID == vsv.lop_id).FirstOrDefault();
                        var nganh = db.nganhs.Where(n => n.ID == vsv.nganh_id).FirstOrDefault();
                        Session["CurrentLop"] = lop.Ten;
                        Session["CurrentNganh"] = nganh.Ten;
                        Session["Pages"] = "Student";
                        return RedirectToAction("Result", "Student");
                    }
                    else
                    {
                        return RedirectToAction("Login", "Accounts");
                    }
                }
            }
            else
            {
                return RedirectToAction("Index", "Accounts");
            }
        }

        public ActionResult Logout()
        {
            if (HttpContext.Session["Pages"].ToString().Equals("Student"))
            {
                RemoveCookieSession();
                return RedirectToAction("Index", "Home");
            }
            else
            {
                RemoveCookieSession();
                return RedirectToAction("Index", "Accounts");
            }
        }

        public void RemoveCookieSession()
        {
            Session.RemoveAll();
            FormsAuthentication.SignOut();

            HttpCookie cookie1 = new HttpCookie(FormsAuthentication.FormsCookieName, "");
            cookie1.Expires = DateTime.Now.AddYears(-1);
            Response.Cookies.Add(cookie1);

            HttpCookie cookie2 = new HttpCookie("ASP.NET_SessionId", "");
            cookie2.Expires = DateTime.Now.AddYears(-1);
            Response.Cookies.Add(cookie2);
        }
    }
}