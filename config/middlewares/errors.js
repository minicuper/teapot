var nav = require('../navbar');

exports.get500 = function(err, req, res, next){
  // treat as 404
  if (~err.message.indexOf('not found')) return next();

  // log it
  console.error(err.stack);

  res.locals.navbar = nav.getNavibar();

  res.locals.bc_list = [{
        name: "Главная страница",
        href: "/"
      }];

  res.locals.bc_active = "Ошибка 500";

  // error page
  res.status(500).render('500', { error: err.stack });
}

exports.get404 = function(req, res, next){
      if (req.path.indexOf('admin') === -1) {
        res.locals.navbar = nav.getNavibar();

        res.locals.bc_list = [{
              name: "Главная страница",
              href: "/"
            }];

        res.locals.bc_active = "Ошибка 404";

        res.status(404).render('404', { url: req.originalUrl, error: 'Not found' });
      } else {

        res.locals.bc_list = [{
          name: "Главная страница админки",
          href: "/admin"
        }];

        res.locals.bc_active = "Ошибка 404";

        res.status(404).render('404', {
          layout: 'admin/layouts/default',
          partials: {
            adm_breadcrumb: 'admin/layouts/adm_breadcrumb',
            adm_sidebar: 'admin/layouts/adm_sidebar',
            adm_navbar: 'admin/layouts/adm_navbar',
          }
        });
      }
}