using DaoTaoTinChiCIT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MoreLinq;
using PagedList;

namespace DaoTaoTinChiCIT.Controllers
{
    public class AdminController : Controller
    {
        daotaotinchiEntities db = new daotaotinchiEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Profiles()
        {
            return View();
        }

        # region Quản lý tài khoản
        [HttpGet]
        public ActionResult Member(int? id)
        {
            ViewData["Nhom"] = db.groups.ToList();
            if (id == null)
            {
                ViewData["ListUsers"] = db.web_users.OrderByDescending(us => us.id).ToList();
            }
            else
            {
                ViewData["ListUsers"] = db.web_users.Where(u => u.group_id == id).OrderByDescending(u => u.id).ToList();
            }
            return View();
        }

        [HttpPost]
        public ActionResult AddUser(string MaDN, string MatKhau, string NhapLaiMK, string HoTen, int Nhom)
        {
            if (MaDN == "" || MatKhau == "" || NhapLaiMK == "" || HoTen == "")
            {
                TempData["Error"] = "Thêm tài khoản thất bại!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
            else
            {
                if (!MatKhau.Equals(NhapLaiMK))
                {
                    TempData["Error"] = "Thêm tài khoản thất bại!";
                    ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                    return RedirectToAction("Member", "Admin");
                }
                else
                {
                    var v = db.web_users.Where(us => us.username.Equals(MaDN)).FirstOrDefault();
                    if (v == null)
                    {
                        web_users us = new web_users
                        {
                            username = MaDN,
                            pwd = MatKhau,
                            fullName = HoTen,
                            group_id = Nhom,
                            locked = false
                        };
                        db.web_users.Add(us);
                        db.SaveChanges();
                        TempData["Success"] = "Thêm tài khoản thành công!";
                        ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                        return RedirectToAction("Member", "Admin");
                    }
                    else
                    {
                        TempData["Error"] = "Thêm tài khoản thất bại! Người dùng đã tồn tại.";
                        ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                        return RedirectToAction("Member", "Admin");
                    }
                }
            }
        }

        [HttpPost]
        public ActionResult EditUser(int id, string MaDN, string HoTen, int Nhom)
        {
            if (ModelState.IsValid)
            {
                web_users us = db.web_users.Single(u => u.id.Equals(id));
                us.username = MaDN;
                us.fullName = HoTen;
                us.group_id = Nhom;
                db.SaveChanges();
                TempData["Success"] = "Sửa tài khoản thành công!";
            }
            else
            {
                TempData["Error"] = "Sửa tài khoản thất bại!";
            }
            return RedirectToAction("Member", "Admin");
        }

        public ActionResult DelUser(int ID)
        {
            if (ModelState.IsValid)
            {
                var us = db.web_users.Find(ID);
                db.web_users.Remove(us);
                db.SaveChanges();
                TempData["Success"] = "Xóa tài khoản thành công!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
            else
            {
                TempData["Error"] = "Xóa tài khoản thất bại!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
        }

        public ActionResult BanUser(int ID)
        {
            if (ModelState.IsValid)
            {
                web_users us = db.web_users.Single(u => u.id.Equals(ID));
                us.locked = true;
                db.SaveChanges();
                TempData["Success"] = "Khóa tài khoản thành công!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
            else
            {
                TempData["Error"] = "Khóa tài khoản thất bại!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
        }

        public ActionResult RestoreUser(int ID)
        {
            if (ModelState.IsValid)
            {
                web_users us = db.web_users.Single(u => u.id.Equals(ID));
                us.locked = false;
                db.SaveChanges();
                TempData["Success"] = "Khôi phục tài khoản thành công!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
            else
            {
                TempData["Error"] = "Khôi phục tài khoản thất bại!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
        }

        public ActionResult ResetPass(int ID)
        {
            if (ModelState.IsValid)
            {
                web_users us = db.web_users.Single(u => u.id.Equals(ID));
                us.pwd = "123456";
                db.SaveChanges();
                TempData["Success"] = "Khôi phục mật khẩu thành công!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
            else
            {
                TempData["Error"] = "Khôi phục mật khẩu thất bại!";
                ViewData["ListUsers"] = db.web_users.OrderByDescending(u => u.id).ToList();
                return RedirectToAction("Member", "Admin");
            }
        }
        # endregion

        # region Quản lý thông báo
        public ActionResult Notification()
        {
            ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tt => tt.ID).ToList();
            ViewData["NguoiDang"] = db.web_users.ToList();
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult NewNotification(string TieuDe, string NoiDung, IEnumerable<bool> QuanTrong)
        {
            int macb = 1;
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
                return RedirectToAction("Notification", "Admin");
            }
            else
            {
                TempData["Error"] = "Đăng thông báo thất bại!";
                ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tin => tin.ID).ToList();
                return RedirectToAction("Notification", "Admin");
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
                web_tintuc wtt = db.web_tintuc.Single(t => t.ID.Equals(id));
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
            return RedirectToAction("Notification", "Admin");
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
                return RedirectToAction("Notification", "Admin");
            }
            else
            {
                TempData["Error"] = "Xóa thông báo thất bại!";
                ViewData["ListTinTuc"] = db.web_tintuc.OrderByDescending(tin => tin.ID).ToList();
                return RedirectToAction("Notification", "Admin");
            }
        }
        # endregion

        # region Quản lý đăng ký tín chỉ
        public ActionResult Educate()
        {
            return View();
        }

        # region Danh sách đăng ký
        [HttpGet]
        public ActionResult SubscriptionList(int? nganh)
        {
            ViewData["TGDangKy"] = db.web_thoigiandk.Where(t => t.KhaoSat == false && t.Close == false).DistinctBy(tg => tg.lophp_id).ToList();
            ViewData["LopHocPhan"] = db.lophocphans.ToList();
            Session["Nganh"] = nganh;

            if (nganh == null)
            {
                if (HttpContext.Session["Nganh"] == null)
                {
                    ViewData["HocPhan"] = db.hocphans.ToList();
                    ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten");
                }
                else
                {
                    int manganh = Convert.ToInt32(HttpContext.Session["Nganh"]);
                    ViewData["HocPhan"] = db.hocphans.Where(hp => hp.nganh_id == manganh).ToList();
                    ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten", manganh);
                }
            }
            else
            {
                ViewData["HocPhan"] = db.hocphans.Where(hp => hp.nganh_id == nganh).ToList();
                ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten", nganh);
            }
            return View();
        }

        [HttpGet]
        public ActionResult ViewDetailTrue(int id)
        {
            ViewData["SinhVien"] = db.hoso_sv.ToList();
            ViewData["Lop"] = db.lops.ToList();

            ViewBag.Message = "Danh sách sinh viên đăng ký học phần";
            ViewBag.Action = "CancelRegister";

            var dsdk = db.web_dangky_hp.Where(dk => dk.lophp_id == id && dk.Huy == false).ToList();
            return PartialView("_ViewDetail", dsdk);
        }

        [HttpGet]
        public ActionResult CancelRegister(int id)
        {
            if (ModelState.IsValid)
            {
                web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == id);
                dk.Huy = true;
                db.SaveChanges();

                TempData["Success"] = "Hủy sinh viên đăng ký lớp học phần thành công!";
            }
            else
            {
                TempData["Error"] = "Hủy sinh viên đăng ký lớp học phần thất bại!";
            }

            return RedirectToAction("SubscriptionList", "Admin");
        }
        # endregion

        # region Danh sách hủy đăng ký
        [HttpGet]
        public ActionResult UnSubscriptionList(int? nganh)
        {
            ViewData["TGDangKy"] = db.web_thoigiandk.Where(t => t.KhaoSat == false && t.Close == false).DistinctBy(tg => tg.lophp_id).ToList();
            ViewData["LopHocPhan"] = db.lophocphans.ToList();
            Session["Nganh"] = nganh;

            if (nganh == null)
            {
                if (HttpContext.Session["Nganh"] == null)
                {
                    ViewData["HocPhan"] = db.hocphans.ToList();
                    ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten");
                }
                else
                {
                    int manganh = Convert.ToInt32(HttpContext.Session["Nganh"]);
                    ViewData["HocPhan"] = db.hocphans.Where(hp => hp.nganh_id == manganh).ToList();
                    ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten", manganh);
                }
            }
            else
            {
                ViewData["HocPhan"] = db.hocphans.Where(hp => hp.nganh_id == nganh).ToList();
                ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten", nganh);
            }
            return View();
        }

        [HttpGet]
        public ActionResult ViewDetailFalse(int id)
        {
            ViewData["SinhVien"] = db.hoso_sv.ToList();
            ViewData["Lop"] = db.lops.ToList();

            ViewBag.Message = "Danh sách sinh viên hủy đăng ký học phần";
            ViewBag.Action = "RestoreRegister";


            var dsdk = db.web_dangky_hp.Where(dk => dk.lophp_id == id && dk.Huy == true).ToList();
            return PartialView("_ViewDetail", dsdk);
        }

        [HttpGet]
        public ActionResult RestoreRegister(int id)
        {
            if (ModelState.IsValid)
            {
                web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == id);
                dk.Huy = false;
                db.SaveChanges();

                TempData["Success"] = "Khôi phục sinh viên đăng ký lớp học phần thành công!";
            }
            else
            {
                TempData["Error"] = "Khôi phục sinh viên đăng ký lớp học phần thất bại!";
            }
            return RedirectToAction("UnSubscriptionList", "Admin");
        }
        # endregion

        # region Lớp học phần đang mở đăng ký
        [HttpGet]
        public ActionResult ClassOpen(int? nganh)
        {
            ViewData["ThoiGianDK"] = db.web_thoigiandk.Where(t => t.KhaoSat == false && t.Close == false).ToList();
            ViewData["LopHocPhan"] = db.lophocphans.ToList();
            Session["Nganh"] = nganh;

            if (nganh == null)
            {
                if (HttpContext.Session["Nganh"] == null)
                {
                    ViewData["HocPhan"] = db.hocphans.ToList();
                    ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten");
                }
                else
                {
                    int manganh = Convert.ToInt32(HttpContext.Session["Nganh"]);
                    ViewData["HocPhan"] = db.hocphans.Where(hp => hp.nganh_id == manganh).ToList();
                    ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten", manganh);
                }
            }
            else
            {
                ViewData["HocPhan"] = db.hocphans.Where(hp => hp.nganh_id == nganh).ToList();
                ViewBag.Nganh = new SelectList(db.nganhs, "ID", "Ten", nganh);
            }
            return View();
        }

        [HttpPost]
        public ActionResult EditClass(int ID, string MaLHP, string Ngay1, string Ngay2, int? SoCho)
        {
            DateTime _ngay1 = Convert.ToDateTime(Ngay1);
            DateTime _ngay2 = Convert.ToDateTime(Ngay2);

            if (ModelState.IsValid)
            {
                web_thoigiandk dk = db.web_thoigiandk.Single(d => d.ID == ID);
                dk.Ngay1 = _ngay1;
                dk.Ngay2 = _ngay2;
                db.SaveChanges();

                lophocphan lhp = db.lophocphans.Single(l => l.Ma == MaLHP);
                lhp.soluong = SoCho;
                db.SaveChanges();

                TempData["Success"] = "Thay đổi thời gian đăng ký lớp học phần thành công!";
            }
            else
            {
                TempData["Error"] = "Thay đổi thời gian đăng ký lớp học phần thất bại!";
            }

            return RedirectToAction("ClassOpen", "Admin");
        }

        [HttpPost]
        public ActionResult DelPartialClasses(int ID)
        {
            if (ModelState.IsValid)
            {
                web_thoigiandk tg = db.web_thoigiandk.Single(l => l.ID == ID);
                tg.Close = true;
                db.SaveChanges();

                TempData["Success"] = "Hủy lớp học phần thành công!";
                return RedirectToAction("ClassOpen", "Admin");
            }
            else
            {
                TempData["Error"] = "Hủy lớp học phần thất bại!";
                return RedirectToAction("ClassOpen", "Admin");
            }
        }
        # endregion

        # region Danh sách lớp học phần
        [HttpGet]
        public ActionResult PartialClasses()
        {
            int nh = Convert.ToInt32(HttpContext.Session["NamHoc"]);
            int hk = Convert.ToInt32(HttpContext.Session["HocKy"]);
            int ng = Convert.ToInt32(HttpContext.Session["Nganh"]);

            ViewData["KhungHP"] = db.khung_hp.DistinctBy(k => k.hp_id).ToList();
            ViewData["Khung"] = db.khungs.ToList();
            ViewData["NamHoc"] = db.lophpnamhocs.ToList();
            ViewData["HocKy"] = db.dm_loaihocky.ToList();
            ViewData["Nganh"] = db.nganhs.ToList();
            ViewData["HocPhan"] = db.hocphans.ToList();

            ViewData["NganhKT"] = db.nganhs.Where(n => n.ID == ng).ToList();

            if (nh == 0 || hk == 0 || ng == 0)
            {
                ViewData["LopHocPhan"] = db.lophocphans.Where(l => l.ID == 0).ToList();
            }
            else
            {
                ViewData["LopHocPhan"] = db.lophocphans.Where(l => l.namhoc_id == nh && l.hocky == hk).DistinctBy(l => l.hocphan_id).ToList();
            }

            return View();
        }

        [HttpPost]
        public ActionResult PartialClasses(int? namhoc, int? hocky, int? nganh)
        {
            ViewData["KhungHP"] = db.khung_hp.DistinctBy(k => k.hp_id).ToList();
            ViewData["NamHoc"] = db.lophpnamhocs.ToList();
            ViewData["HocKy"] = db.dm_loaihocky.ToList();
            ViewData["HocPhan"] = db.hocphans.ToList();
            ViewData["Nganh"] = db.nganhs.ToList();

            ViewData["NganhKT"] = db.nganhs.Where(n => n.ID == nganh).ToList();

            Session["NamHoc"] = namhoc;
            Session["HocKy"] = hocky;
            Session["Nganh"] = nganh;

            if (namhoc == null || hocky == null || nganh == null)
            {
                ViewData["LopHocPhan"] = db.lophocphans.Where(l => l.ID == 0).DistinctBy(l => l.hocphan_id).ToList();
            }
            else
            {
                ViewData["LopHocPhan"] = db.lophocphans.Where(l => l.namhoc_id == namhoc && l.hocky == hocky).DistinctBy(l => l.hocphan_id).ToList();
            }

            return View();
        }

        [HttpGet]
        public ActionResult ViewLHP(int id)
        {
            int nh = Convert.ToInt32(HttpContext.Session["NamHoc"]);
            int hk = Convert.ToInt32(HttpContext.Session["HocKy"]);
            int n = Convert.ToInt32(HttpContext.Session["Nganh"]);

            ViewData["GiaoVien"] = db.hoso_cb.ToList();
            ViewData["DonVi"] = db.donvis.ToList();
            ViewData["KhungHP"] = db.khung_hp.DistinctBy(k => k.hp_id).ToList();

            var lhp = db.lophocphans.Where(l => l.namhoc_id == nh && l.hocky == hk && l.hocphan_id == id).ToList();

            return PartialView("_ViewPartialClasses", lhp);
        }

        [HttpPost]
        public ActionResult OpenClass(int ID, string MaLHP, string Ngay1, string Ngay2, int? SoCho)
        {
            DateTime _ngay1 = Convert.ToDateTime(Ngay1);
            DateTime _ngay2 = Convert.ToDateTime(Ngay2);

            int nh = Convert.ToInt32(HttpContext.Session["NamHoc"]);
            int hk = Convert.ToInt32(HttpContext.Session["HocKy"]);

            var lophp = db.lophocphans.Where(l => l.Ma == MaLHP).FirstOrDefault();
            string mhp = Convert.ToString(lophp.hocphan_id);

            var v = db.web_thoigiandk.Where(us => us.lophp_id == MaLHP).FirstOrDefault();
            if (v == null)
            {
                web_thoigiandk dk = new web_thoigiandk
                {
                    lophp_id = Convert.ToString(ID),
                    hocphan_id = mhp,
                    Ngay1 = _ngay1,
                    Ngay2 = _ngay2,
                    KhaoSat = false,
                    namhoc_id = nh,
                    hocky_id = hk,
                    Close = false
                };
                db.web_thoigiandk.Add(dk);
                db.SaveChanges();

                lophocphan lhp = db.lophocphans.Single(l => l.Ma == MaLHP);
                lhp.soluong = SoCho;
                db.SaveChanges();

                TempData["Success"] = "Mở lớp học phần thành công!";
                return RedirectToAction("PartialClasses", "Admin");
            }
            else
            {
                TempData["Error"] = "Mở lớp học phần thất bại! Lớp học phần đã mở.";
                return RedirectToAction("PartialClasses", "Admin");
            }
        }
        # endregion

        # region Khảo sát đăng ký
        public ActionResult SurveyRegister()
        {
            ViewData["Nganh"] = db.nganhs.OrderBy(n => n.ma).ToList();
            ViewData["HocPhan"] = db.hocphans.ToList();

            ViewData["TGDangKy"] = db.web_thoigiandk.Where(t => t.KhaoSat == true && t.Close == false).ToList();
            return View();
        }

        [HttpGet]
        public ActionResult ViewDetailSurvey(int id)
        {
            ViewData["SinhVien"] = db.hoso_sv.ToList();
            ViewData["Lop"] = db.lops.ToList();

            ViewBag.Message = "Danh sách sinh viên đăng ký khảo sát";
            ViewBag.Action = "CancelSurvey";

            var dsdk = db.web_dangky_khaosat.Where(ks => ks.hocphan_id == id && ks.Huy == false).ToList();
            return PartialView("_ViewDetailSurvey", dsdk);
        }

        [HttpPost]
        public ActionResult EditSurveyRegister(string Action, int ID, string MaHP, string Ngay1, string Ngay2)
        {
            DateTime _ngay1 = Convert.ToDateTime(Ngay1);
            DateTime _ngay2 = Convert.ToDateTime(Ngay2);

            if (Action == "Edit")
            {
                if (ModelState.IsValid)
                {
                    web_thoigiandk dk = db.web_thoigiandk.Single(d => d.ID == ID);
                    dk.Ngay1 = _ngay1;
                    dk.Ngay2 = _ngay2;
                    db.SaveChanges();

                    TempData["Success"] = "Thay đổi thời gian mở khảo sát thành công!";
                }
                else
                {
                    TempData["Error"] = "Thay đổi thời gian mở khảo sát thất bại!";
                }
            }
            else
            {
                var v = db.web_thoigiandk.Where(us => us.hocphan_id == MaHP).FirstOrDefault();
                if (v == null)
                {
                    web_thoigiandk dk = new web_thoigiandk
                    {
                        hocphan_id = Convert.ToString(ID),
                        Ngay1 = _ngay1,
                        Ngay2 = _ngay2,
                        KhaoSat = true,
                        Close = false
                    };
                    db.web_thoigiandk.Add(dk);
                    db.SaveChanges();

                    TempData["Success"] = "Mở đăng ký khảo sát thành công!";
                }
                else
                {
                    TempData["Error"] = "Mở đăng ký khảo sát thất bại! Học phần đã mở.";
                }
            }

            return RedirectToAction("SurveyRegister", "Admin");
        }

        public ActionResult DelSurveyRegister(int ID)
        {
            if (ModelState.IsValid)
            {
                web_thoigiandk tg = db.web_thoigiandk.Single(l => l.ID == ID);
                tg.Close = true;
                db.SaveChanges();

                TempData["Success"] = "Hủy học phần mở khảo sát thành công!";
                return RedirectToAction("SurveyRegister", "Admin");
            }
            else
            {
                TempData["Error"] = "Hủy học phần khảo sát thất bại!";
                return RedirectToAction("SurveyRegister", "Admin");
            }
        }

        [HttpGet]
        public ActionResult CancelSurveyRegister(int id)
        {
            if (ModelState.IsValid)
            {
                web_dangky_khaosat dk = db.web_dangky_khaosat.Single(d => d.ID == id);
                dk.Huy = true;
                db.SaveChanges();

                TempData["Success"] = "Hủy sinh viên đăng ký khảo sát thành công!";
            }
            else
            {
                TempData["Error"] = "Hủy sinh viên đăng ký khảo sát thất bại!";
            }

            return RedirectToAction("SurveyRegister", "Admin");
        }

        [HttpGet]
        public ActionResult ViewModule(int id)
        {
            var hp = db.hocphans.Where(h => h.nganh_id == id).ToList();
            ViewData["KhungHP"] = db.khung_hp.DistinctBy(k => k.hp_id).ToList();

            return PartialView("_ViewModule", hp);
        }
        #endregion
        # endregion
    }
}