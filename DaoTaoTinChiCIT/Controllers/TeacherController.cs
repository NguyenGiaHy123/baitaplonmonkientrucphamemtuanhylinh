using DaoTaoTinChiCIT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DaoTaoTinChiCIT.Controllers
{
    public class TeacherController : Controller
    {
        daotaotinchiEntities db = new daotaotinchiEntities();

        public ActionResult Index()
        {
            if (HttpContext.Session["CurrentLogin"] == null)
            {
                return RedirectToAction("Login", "Teacher");
            }
            else
            {
                return RedirectToAction("Schedule", "Teacher");
            }
        }

        public ActionResult Schedule()
        {
            return View();
        }

        public ActionResult Profiles()
        {
            return View();
        }

        public ActionResult Notification()
        {
            ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tt => tt.ID).ToList();
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult NewNotification(string TieuDe, string NoiDung, IEnumerable<bool> QuanTrong)
        {
            int macb = Convert.ToInt32(HttpContext.Session["CurrentLogin"]);
            int quantrong;
            if (QuanTrong != null && QuanTrong.Count() == 2)
            {
                quantrong = 1;
            }
            else
            {
                quantrong = 0;
            }

            web_tintuc tt = new web_tintuc
            {
                cb_id = macb,
                TieuDe = TieuDe,
                ngaytao = DateTime.Now.Date,
                Noidung = HttpUtility.HtmlDecode(NoiDung),
                QuanTrong = quantrong
            };

            if (ModelState.IsValid)
            {
                db.web_tintuc.Add(tt);
                db.SaveChanges();
                TempData["Success"] = "Đăng thông báo thành công!";
                ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tin => tin.ID).ToList();
                return RedirectToAction("Notification", "Teacher");
            }
            else
            {
                TempData["Error"] = "Đăng thông báo thất bại!";
                ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tin => tin.ID).ToList();
                return RedirectToAction("Notification", "Teacher");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult EditNotification(int id, string TieuDe, string NoiDung, IEnumerable<bool> QuanTrong)
        {
            int quantrong;
            if (QuanTrong != null && QuanTrong.Count() == 2)
            {
                quantrong = 1;
            }
            else
            {
                quantrong = 0;
            }

            if (ModelState.IsValid)
            {
                web_tintuc wtt = db.web_tintuc.Single(t => t.ID == id);
                wtt.TieuDe = TieuDe;
                wtt.Noidung = HttpUtility.HtmlDecode(NoiDung);
                wtt.QuanTrong = quantrong;
                db.SaveChanges();
                TempData["Success"] = "Sửa thông báo thành công!";
            }
            else
            {
                TempData["Error"] = "Sửa thông báo thất bại!";
            }
            return RedirectToAction("Notification", "Teacher");
        }

        public ActionResult DelNotification(int ID)
        {
            if (ModelState.IsValid)
            {
                var tt = db.web_tintuc.Find(ID);
                db.web_tintuc.Remove(tt);
                db.SaveChanges();
                TempData["Success"] = "Xóa thông báo thành công!";
                ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tin => tin.ID).ToList();
                return RedirectToAction("Notification", "Teacher");
            }
            else
            {
                TempData["Error"] = "Xóa thông báo thất bại!";
                ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tin => tin.ID).ToList();
                return RedirectToAction("Notification", "Teacher");
            }
        }
    }
}