using DaoTaoTinChiCIT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MoreLinq;

namespace DaoTaoTinChiCIT.Controllers
{
    public class StudentController : Controller
    {
        private daotaotinchiEntities db = new daotaotinchiEntities();

        public ActionResult Index()
        {
            if (HttpContext.Session["CurrentLogin"] == null)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                return RedirectToAction("Profiles", "Student");
            }
        }

        public ActionResult Guide()
        {
            return RedirectToAction("Guide", "Home");
        }

        # region Kết quả học tập
        public ActionResult Result()
        {
            if (HttpContext.Session["CurrentLogin"] == null)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                string mssv = HttpContext.Session["CurrentLogin"].ToString();
                int masv = Convert.ToInt32(mssv);
                var diemhv = db.hocvu_test.Where(hv => hv.id_sv == masv).OrderBy(hv => hv.hocky).OrderBy(hv => hv.namhoc).ToList();
                var sv = db.hoso_sv.Where(s => s.ma == mssv).FirstOrDefault();
                var lop = db.lops.Where(l => l.ID == sv.lop_id).FirstOrDefault();

                Session["Khung"] = lop.khung_id;

                ViewData["NamHoc"] = db.lophpnamhocs.ToList();
                ViewData["DiemRL"] = db.diemrenluyens.Where(drl => drl.masv == masv).ToList();
                ViewData["DiemChiTiet"] = db.lophpdktamthois.Where(lhpdk => lhpdk.masv == mssv).ToList(); // Điểm chi tiết từng học phần
                ViewData["LopHocPhan"] = db.lophocphans.ToList();
                ViewData["HocPhan"] = db.hocphans.ToList();
                ViewData["KhungHP"] = db.khung_hp.Where(k => k.khung_id == lop.khung_id).ToList();

                return View(diemhv);
            }
        }
        # endregion

        #region Thông tin cá nhân
        public ActionResult Profiles()
        {
            if (HttpContext.Session["CurrentLogin"] == null)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                string mssv = HttpContext.Session["CurrentLogin"].ToString();
                hoso_sv hssv = db.hoso_sv.Where(sv => sv.ma.Equals(mssv)).FirstOrDefault();

                List<GioiTinh> gioitinh = new List<GioiTinh>();
                gioitinh.Add(new GioiTinh() { Id = 0, Name = "Nữ" });
                gioitinh.Add(new GioiTinh() { Id = 1, Name = "Nam" });
                ViewBag.GioiTinh = new SelectList(gioitinh, "Id", "Name", hssv.gioitinh);
                ViewBag.DanToc = new SelectList(db.dm_dantoc, "id", "ten", hssv.dantoc_id);
                ViewBag.NoiSinh = new SelectList(db.dm_noisinh, "ten", "ten", hssv.noisinh);
                ViewBag.QuocTich = new SelectList(db.dm_quoctich, "id", "ten", hssv.quoctich_id);

                var lop = db.lops.Where(l => l.ID == hssv.lop_id).FirstOrDefault();
                var nganh = db.nganhs.Where(n => n.ID == hssv.nganh_id).FirstOrDefault();

                ViewData["Lop"] = lop.Ten;
                ViewData["Nganh"] = nganh.Ten;
                return View(hssv);
            }
        }

        public ActionResult ChangeInfo()
        {
            return RedirectToAction("Profile", "Student");
        }

        public ActionResult ChangePass(string MatKhauCu, string MatKhauMoi, string NhapLaiMK)
        {
            if (MatKhauCu == "" || MatKhauMoi == "" || NhapLaiMK == "")
            {
                TempData["Error"] = "Đổi mật khẩu thất bại!";
                return RedirectToAction("Profiles", "Student");
            }
            else
            {
                if (!MatKhauMoi.Equals(NhapLaiMK))
                {
                    TempData["Error"] = "Đổi mật khẩu thất bại!";
                    return RedirectToAction("Profiles", "Student");
                }
                else
                {
                    var v = db.web_users.Where(us => us.pwd.Equals(MatKhauCu)).FirstOrDefault();
                    string mssv = HttpContext.Session["CurrentLogin"].ToString();
                    if (v != null)
                    {
                        web_users user = db.web_users.Single(us => us.username.Equals(mssv));
                        user.pwd = MatKhauMoi;
                        db.SaveChanges();
                        TempData["Success"] = "Đổi mật khẩu thành công!";
                        return RedirectToAction("Profiles", "Student");
                    }
                    else
                    {
                        TempData["Error"] = "Đổi mật khẩu thất bại!";
                        return RedirectToAction("Profiles", "Student");
                    }
                }
            }
        }
        # endregion

        #region Đăng ký học phần
        public ActionResult Register()
        {
            if (HttpContext.Session["CurrentLogin"] == null)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                var now = DateTime.Now;
                var v = db.web_thoigiandk.Where(tg => tg.Close == true).FirstOrDefault();
                if (v != null)
                {
                    return RedirectToAction("Result", "Student");
                }
                else
                {
                    //Lấy thông tin sinh viên
                    string msv = HttpContext.Session["CurrentLogin"].ToString();
                    int masv = Convert.ToInt32(msv);

                    var sv = db.hoso_sv.Where(s => s.ma == msv).FirstOrDefault();

                    var lops = db.lops.Where(l => l.ID == sv.lop_id).FirstOrDefault();

                    var khung = db.khungs.Where(k => k.id == lops.khung_id).FirstOrDefault();

                    var namhoc_hocky = db.web_thoigiandk.OrderByDescending(nh => nh.namhoc_id).FirstOrDefault();
                    int hocky = namhoc_hocky.hocky_id.Value; //?
                    int namhoc = namhoc_hocky.namhoc_id.Value;//?

                    Session["Khung"] = khung.id;
                    Session["HocKy"] = hocky;
                    Session["NamHoc"] = namhoc;
                    Session["Nganh"] = lops.nganh_id;

                    ViewData["GiaoVien"] = db.hoso_cb.ToList();
                    ViewData["DonVi"] = db.donvis.ToList();
                    ViewData["KhungHP"] = db.khung_hp.Where(k => k.khung_id == khung.id).ToList();
                    ViewData["HocPhan"] = db.hocphans.ToList();
                    ViewData["TKB"] = db.thoikhoabieux.ToList();
                    ViewData["LopHocPhan"] = db.lophocphans.Where(l => l.namhoc_id == namhoc && l.hocky == hocky).ToList();

                    //Lớp học phần ưu tiên
                    ViewData["LopHocPhanKT"] = db.lophocphans.ToList();

                    ViewData["DiemChiTiet"] = db.lophpdktamthois.Where(lhpdk => lhpdk.masv == msv && lhpdk.diemtb < 4.0d).ToList();
                    ViewData["LopHocPhanDKUT"] = db.web_thoigiandk.Where(tg => tg.Close == false).ToList();

                    //Lớp học phần đăng ký
                    ViewData["LopHocPhanMoDK"] = db.web_thoigiandk.Where(tg => tg.Close == false).DistinctBy(tg => tg.hocphan_id).ToList();

                    //Kết quả đăng ký
                    ViewData["KetQuaDK"] = db.web_dangky_hp.Where(dk => dk.sv_id == masv && dk.Huy == false && dk.Close == false).ToList();

                    return View();
                }
            }
        }

        [HttpGet]
        public ActionResult ViewDetail(int id)
        {
            int khung = Convert.ToInt32(HttpContext.Session["Khung"]);
            int hocky = Convert.ToInt32(HttpContext.Session["HocKy"]);
            int namhoc = Convert.ToInt32(HttpContext.Session["NamHoc"]);

            ViewData["GiaoVien"] = db.hoso_cb.ToList();
            ViewData["DonVi"] = db.donvis.ToList();
            ViewData["KhungHP"] = db.khung_hp.Where(k => k.khung_id == khung).ToList();

            var lhp = db.lophocphans.Where(l => l.namhoc_id == namhoc && l.hocky == hocky && l.hocphan_id == id).ToList();

            return PartialView("_ViewDetail", lhp);
        }

        [HttpGet]
        public ActionResult Submit(int id)
        {
            int khung = Convert.ToInt32(HttpContext.Session["Khung"]);
            string msv = HttpContext.Session["CurrentLogin"].ToString();
            int masv = Convert.ToInt32(msv);

            var lhp = db.lophocphans.Where(l => l.ID == id).FirstOrDefault();
            string lophp = Convert.ToString(lhp.ID);
            string hocphan = Convert.ToString(lhp.hocphan_id);

            //Kiểm tra lớp khảo sát
            bool ks;
            var lks = db.web_thoigiandk.Where(k => k.lophp_id == lophp && k.hocphan_id == hocphan).FirstOrDefault();
            if (lks.KhaoSat == true)
            {
                ks = true;
            }
            else
            {
                ks = false;
            }

            //Kiểm tra số tín chỉ đã đăng ký
            //var diemtl = db.hocvu_test.Where(hv => hv.id_sv == masv).OrderBy(hv => hv.hocky).OrderByDescending(hv => hv.namhoc).FirstOrDefault();
            //double diem = diemtl.diemTL4.Value;

            var hpqh = db.hocphan_quanhe.Where(qh => qh.hp_id == lhp.hocphan_id && qh.khung_hp_id == khung).FirstOrDefault();
            if (hpqh == null)
            {
                var v = db.web_dangky_hp.Where(dk => dk.sv_id == masv && dk.hocphan_id == lhp.hocphan_id).FirstOrDefault();
                if (v == null)
                {
                    web_dangky_hp dk = new web_dangky_hp
                    {
                        lophp_id = lhp.ID,
                        hocphan_id = lhp.hocphan_id,
                        sv_id = masv,
                        thoigian = DateTime.Now,
                        Huy = false,
                        KhaoSat = ks,
                        Close = false
                    };
                    db.web_dangky_hp.Add(dk);
                    db.SaveChanges();
                    TempData["Success"] = "Đăng ký thành công!";
                }
                else
                {
                    if (v.Huy == true)
                    {
                        if (ModelState.IsValid)
                        {
                            web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == v.ID);
                            dk.Huy = false;
                            db.SaveChanges();

                            TempData["Success"] = "Đăng ký thành công!";
                        }
                        else
                        {
                            TempData["Error"] = "Đã có lỗi xảy ra. Đăng ký thất bại!";
                        }
                    }
                    else
                    {
                        TempData["Error"] = "Đăng ký thất bại! Bạn đã đăng ký học phần này. Vui lòng chọn học phần khác.";
                    }
                }
            }
            else
            {
                if (hpqh.loaihp_quanhe_id == 4)
                {
                    bool kthocphan = false;
                    var lhocphan = db.lophocphans.Where(l => l.hocphan_id == hpqh.hp_quanhe_trc).ToList();
                    var diemhp = db.lophpdktamthois.Where(dhp => dhp.masv == msv).ToList();
                    foreach (var item in diemhp)
                    {
                        foreach (var item2 in lhocphan)
                        {
                            if (item.idlop == item2.ID)
                            {
                                if (item.diemtb > 4.0)
                                {
                                    kthocphan = true;
                                }
                            }
                        }
                    }

                    if (kthocphan == true)
                    {
                        var v = db.web_dangky_hp.Where(dk => dk.sv_id == masv && dk.hocphan_id == lhp.hocphan_id).FirstOrDefault();
                        if (v == null)
                        {
                            web_dangky_hp dk = new web_dangky_hp
                            {
                                lophp_id = lhp.ID,
                                hocphan_id = lhp.hocphan_id,
                                sv_id = masv,
                                thoigian = DateTime.Now,
                                Huy = false,
                                KhaoSat = ks,
                                Close = false
                            };
                            db.web_dangky_hp.Add(dk);
                            db.SaveChanges();
                            TempData["Success"] = "Đăng ký thành công!";
                        }
                        else
                        {
                            if (v.Huy == true)
                            {
                                if (ModelState.IsValid)
                                {
                                    web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == v.ID);
                                    dk.Huy = false;
                                    db.SaveChanges();

                                    TempData["Success"] = "Đăng ký thành công!";
                                }
                                else
                                {
                                    TempData["Error"] = "Đã có lỗi xảy ra. Đăng ký thất bại!";
                                }
                            }
                            else
                            {
                                TempData["Error"] = "Đăng ký thất bại! Bạn đã đăng ký học phần này. Vui lòng chọn học phần khác.";
                            }
                        }
                    }
                    else
                    {
                        var tenhp = db.hocphans.Where(t => t.ID == hpqh.hp_quanhe_trc).FirstOrDefault();
                        TempData["Error"] = "Đăng ký thất bại! Bạn phải học qua học phần '" + tenhp.Ten + "' trước khi đăng ký học phần này.";
                    }
                }
                else if (hpqh.loaihp_quanhe_id == 5)
                {
                    bool kthocphan = false;
                    var lhocphan = db.lophocphans.Where(l => l.hocphan_id == hpqh.hp_quanhe_trc).ToList();
                    var diemhp = db.lophpdktamthois.Where(dhp => dhp.masv == msv).ToList();
                    foreach (var item in diemhp)
                    {
                        foreach (var item2 in lhocphan)
                        {
                            if (item.idlop == item2.ID)
                            {
                                kthocphan = true;
                            }
                        }
                    }

                    if (kthocphan == true)
                    {
                        var v = db.web_dangky_hp.Where(dk => dk.sv_id == masv && dk.hocphan_id == lhp.hocphan_id).FirstOrDefault();
                        if (v == null)
                        {
                            web_dangky_hp dk = new web_dangky_hp
                            {
                                lophp_id = lhp.ID,
                                hocphan_id = lhp.hocphan_id,
                                sv_id = masv,
                                thoigian = DateTime.Now,
                                Huy = false,
                                KhaoSat = ks,
                                Close = false
                            };
                            db.web_dangky_hp.Add(dk);
                            db.SaveChanges();
                            TempData["Success"] = "Đăng ký thành công!";
                        }
                        else
                        {
                            if (v.Huy == true)
                            {
                                if (ModelState.IsValid)
                                {
                                    web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == v.ID);
                                    dk.Huy = false;
                                    db.SaveChanges();

                                    TempData["Success"] = "Đăng ký thành công!";
                                }
                                else
                                {
                                    TempData["Error"] = "Đã có lỗi xảy ra. Đăng ký thất bại!";
                                }
                            }
                            else
                            {
                                TempData["Error"] = "Đăng ký thất bại! Bạn đã đăng ký học phần này. Vui lòng chọn học phần khác.";
                            }
                        }
                    }
                    else
                    {
                        var tenhp = db.hocphans.Where(t => t.ID == hpqh.hp_quanhe_trc).FirstOrDefault();
                        TempData["Error"] = "Đăng ký thất bại! Bạn vui lòng học trước học phần '" + tenhp.Ten + "'.";
                    }
                }
                else
                {
                    var ktlhp = db.web_dangky_hp.Where(dk => dk.sv_id == masv && dk.hocphan_id == hpqh.hp_quanhe_trc).FirstOrDefault();
                    if (ktlhp == null)
                    {
                        //Đăng ký
                        var v = db.web_dangky_hp.Where(dk => dk.sv_id == masv && dk.hocphan_id == lhp.hocphan_id).FirstOrDefault();
                        if (v == null)
                        {
                            web_dangky_hp dk = new web_dangky_hp
                            {
                                lophp_id = lhp.ID,
                                hocphan_id = lhp.hocphan_id,
                                sv_id = masv,
                                thoigian = DateTime.Now,
                                Huy = false,
                                KhaoSat = ks,
                                Close = false
                            };
                            db.web_dangky_hp.Add(dk);
                            db.SaveChanges();

                            var tenhp = db.hocphans.Where(t => t.ID == hpqh.hp_quanhe_trc).FirstOrDefault();
                            TempData["Success"] = "Đăng ký thành công! Bạn nên đăng ký thêm học phần '" + tenhp.Ten + "'.";
                        }
                        else
                        {
                            if (v.Huy == true)
                            {
                                if (ModelState.IsValid)
                                {
                                    web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == v.ID);
                                    dk.Huy = false;
                                    db.SaveChanges();

                                    var tenhp = db.hocphans.Where(t => t.ID == hpqh.hp_quanhe_trc).FirstOrDefault();
                                    TempData["Success"] = "Đăng ký thành công! Bạn nên đăng ký thêm học phần '" + tenhp.Ten + "'.";

                                }
                                else
                                {
                                    TempData["Error"] = "Đã có lỗi xảy ra. Đăng ký thất bại!";
                                }
                            }
                            else
                            {
                                TempData["Error"] = "Đăng ký thất bại! Bạn đã đăng ký học phần này. Vui lòng chọn học phần khác.";
                            }
                        }
                    }
                    else
                    {
                        //Đăng ký
                        var v = db.web_dangky_hp.Where(dk => dk.sv_id == masv && dk.hocphan_id == lhp.hocphan_id).FirstOrDefault();
                        if (v == null)
                        {
                            web_dangky_hp dk = new web_dangky_hp
                            {
                                lophp_id = lhp.ID,
                                hocphan_id = lhp.hocphan_id,
                                sv_id = masv,
                                thoigian = DateTime.Now,
                                Huy = false,
                                KhaoSat = ks,
                                Close = false
                            };
                            db.web_dangky_hp.Add(dk);
                            db.SaveChanges();
                            TempData["Success"] = "Đăng ký thành công!";
                        }
                        else
                        {
                            if (v.Huy == true)
                            {
                                if (ModelState.IsValid)
                                {
                                    web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == v.ID);
                                    dk.Huy = false;
                                    db.SaveChanges();

                                    TempData["Success"] = "Đăng ký thành công!";
                                }
                                else
                                {
                                    TempData["Error"] = "Đã có lỗi xảy ra. Đăng ký thất bại!";
                                }
                            }
                            else
                            {
                                TempData["Error"] = "Đăng ký thất bại! Bạn đã đăng ký học phần này. Vui lòng chọn học phần khác.";
                            }
                        }
                    }
                }
            }

            return RedirectToAction("Register", "Student");
        }

        [HttpPost]
        public ActionResult CancelRegister(int id)
        {
            if (ModelState.IsValid)
            {
                web_dangky_hp dk = db.web_dangky_hp.Single(d => d.ID == id);
                dk.Huy = true;
                db.SaveChanges();

                TempData["Success"] = "Hủy học phần thành công!";
            }
            else
            {
                TempData["Error"] = "Hủy học phần thất bại!";
            }
            return RedirectToAction("Register", "Student");
        }

        public bool DangKy()
        {
            return true;
        }
        # endregion

        # region Tư vấn học tập
        [HttpGet]
        public ActionResult Advisory(int? view)
        {
            int khung = Convert.ToInt32(HttpContext.Session["Khung"].ToString());
            string masv = HttpContext.Session["CurrentLogin"].ToString();
            ViewData["KhungHP"] = db.khung_hp.Where(k => k.khung_id == khung).OrderBy(k => k.hocky).ToList();
            ViewData["HocPhan"] = db.hocphans.ToList();

            if (view == null)
            {
                ViewData["DiemHP"] = db.lophpdktamthois.Where(d => d.ID == 0).ToList();
                ViewData["LopHP"] = db.lophocphans.ToList();
            }
            else if (view == 1)
            {
                ViewData["DiemHP"] = db.lophpdktamthois.Where(d => d.masv == masv).ToList();
                ViewData["LopHP"] = db.lophocphans.ToList();
            }
            else if (view == 2)
            {
                ViewData["DiemHP"] = db.lophpdktamthois.Where(d => d.masv == masv && d.diemtb < 4.0d).ToList();
                ViewData["LopHP"] = db.lophocphans.ToList();
            }
            return View();
        }
        #endregion
    }
}