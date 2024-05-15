using System.Web;
using System.Web.Optimization;

namespace DaoTaoTinChiCIT
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            //Bootstrap
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/js/jquery-1.7.2.min.js",
                      "~/js/excanvas.min.js",
                      "~/js/chart.min.js",
                      "~/js/bootstrap.js",
                      "~/js/base.js",
                      "~/js/faq.js",
                      "~/js/full-calendar/fullcalendar.min.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/css/bootstrap").Include(
                      "~/css/bootstrap.min.css",
                      "~/css/bootstrap-responsive.min.css",
                      "~/css/font-awesome.css",
                      "~/css/style.css",
                      "~/css/pages/faq.css",
                      "~/css/pages/signin.css",
                      "~/css/pages/plans.css",
                      "~/css/pages/reports.css",
                      "~/css/pages/dashboard.css"));

            //Ckeditor
            bundles.Add(new ScriptBundle("~/bundles/ckeditor").Include(
                      "~/ckeditor/ckeditor.js",
                      "~/ckeditor/adapters/jquery.js"));

            //Datetimepicker
            bundles.Add(new StyleBundle("~/css/datetimepicker").Include(
                      "~/css/datetimepicker/bootstrap-datetimepicker.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/datetimepicker").Include(
                      "~/js/datetimepicker/bootstrap-datetimepicker.js",
                      "~/js/datetimepicker/locales/bootstrap-datetimepicker.vi.js"));

            //Data Tables
            bundles.Add(new StyleBundle("~/css/datatables").Include(
                      "~/css/datatables/dataTables.bootstrap.css"));

            bundles.Add(new ScriptBundle("~/bundles/datatables").Include(
                      "~/js/datatables/dataTables.bootstrap.js"));
        }
    }
}
