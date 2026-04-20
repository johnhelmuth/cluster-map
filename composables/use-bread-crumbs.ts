import type {RouteRecordNameGeneric} from "vue-router";

export type BreadCrumbType = {
  name: string, path?: string, isAPage?: boolean, routeName: RouteRecordNameGeneric
};

export const pathComponentToTitle = (pathComponent: string): string => {
  return pathComponent.split('-')
    .map((word) => (word && word.length) ? ((word?.[0] || '').toUpperCase() + word.slice(1)) : '')
    .join(' ');
}


export const useBreadCrumbs = async () => {
  const route = useRoute();
  const router = useRouter();
  const routes = router.getRoutes();

  function pathIsRoutable(path?: string) {
    if (path) {
      const matches = routes.find((route) => route.name || route.path === path)
      if (matches) {
        return matches;
      }
    }
    return false;
  }

  let pathForCrumb = '';
  const breadCrumbMeta = route.path.split('/').splice(1)
    .map((crumb) => {
      pathForCrumb += ('/' + crumb);
      return {name: crumb, path: pathForCrumb} as BreadCrumbType;
    });

  const {data: breadCrumbs} = await useAsyncData(`bread-crumbs-${route.path}`, async () => {
        const breadCrumbPaths = breadCrumbMeta.map((crumb) => crumb.path);
        const pagesData = await queryCollection('content')
          .all()
        // Get the title for each of the breadcrumbs from pagesData, setting isAPage flag, otherwise entitle the path component.
        for (const crumb of breadCrumbMeta) {
          const pageData = pagesData.find((page) => page.path === crumb.path);
          if (pageData) {
            crumb.name = pageData.title;
            crumb.isAPage = true;
          } else {
            const matchedRoute = pathIsRoutable(crumb.path)
            if (matchedRoute) {
              crumb.isAPage = true;
              crumb.name = pathComponentToTitle(crumb.name);
              crumb.routeName = matchedRoute.name;
            } else {
              crumb.name = pathComponentToTitle(crumb.name);
            }
          }
        }

        return breadCrumbMeta;
      }
    )
  ;

  return {breadCrumbs};
}
