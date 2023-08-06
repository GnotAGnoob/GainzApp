import { dictionary } from "./language/dictionary";

export const getPageTitle = (value?: string | null) => {
    if (!value || value === "/") return dictionary.APP_NAME;

    // the route id returns "/page-name" or null, so we need to remove the first character "/""
    const pageTitle = value[0] === "/" ? value.slice(1) : value;
    const capitalizedPageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

    return `${dictionary.APP_NAME} - ${capitalizedPageTitle}`;
};
