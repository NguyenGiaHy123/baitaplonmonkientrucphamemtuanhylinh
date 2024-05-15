using DaoTaoTinChiCIT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using DaoTaoTinChiCIT.ViewModel;
using System.Net;
using System.Web.Security;

namespace DaoTaoTinChiCIT.Controllers
{
    public class HomeController : Controller
    {
        private daotaotinchiEntities db = new daotaotinchiEntities();

        public ActionResult Index(int? page)
        {
            Session["Pages"] = "Home";
            int pageSize = 10;
            int pageNumber = (page ?? 1);
            ViewData["TinTuc"] = db.web_tintuc.OrderByDescending(tt => tt.ID).ToPagedList(pageNumber, pageSize);
            return View();
        }

        public ActionResult Program()
        {
            return View();
        }

        public ActionResult Plan()
        {
            return View();
        }

        public ActionResult Search()
        {
            return View();
        }

        public ActionResult Guide()
        {
            return View();
        }
    }
}