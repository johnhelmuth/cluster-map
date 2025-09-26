
export type BreadCrumbType = {name: string, path?: string, isAPage?: boolean};

export const pathComponentToTitle = (pathComponent: string) : string => {
  return pathComponent ? pathComponent.split('-').map((word) => {
    if (word && word.length) {
      return word[0].toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ') : '';
}

export const useBreadCrumbs = async () => {
  const route = useRoute();

  let pathForCrumb = '';
  const breadCrumbMeta = route.path.split('/').splice(1)
    .map((crumb) => {
      pathForCrumb += ('/' + crumb);
      return {name: crumb, path: pathForCrumb} as BreadCrumbType;
    });

  const { data: breadCrumbs } = await useAsyncData(`bread-crumbs-${route.path}`, async () => {
    const breadCrumbPaths = breadCrumbMeta.map((crumb) => crumb.path);
    const pagesData = await queryCollection('content')
      .where('path', 'IN', breadCrumbPaths)
      .all()
    // Get the title for each of the breadcrumbs from pagesData, setting isAPage flag, otherwise entitle the path component.
    for (const crumb of breadCrumbMeta) {
      const pageData = pagesData.find((page) => page.path === crumb.path);
      if (pageData) {
        crumb.name = pageData.title;
        crumb.isAPage = true;
      } else {
        crumb.name = pathComponentToTitle(crumb.name);
      }
    }
    return breadCrumbMeta;
  });

  return { breadCrumbs };
}
