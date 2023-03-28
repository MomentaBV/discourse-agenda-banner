import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";

export default Component.extend({
  router: service(),

  @discourseComputed("currentUser")
  shouldShow(currentUser) {
    const isStaff = currentUser && currentUser.staff;
    const lowTrustLevel = currentUser && currentUser.trust_level < 2;
    // show banner only for anons and < TL 2
    return !isStaff && (!currentUser || lowTrustLevel);
  },

  @discourseComputed("router.currentRouteName", "router.currentURL")
  discoveryRoute(currentRouteName, currentURL) {
	// Get the last visit date from local storage
    const lastVisitDate = localStorage.getItem('banner-lastSeenAt');

	// Check if last visit date is missing or more than a day ago
	const oneDay = 60 * 1000; // 1 day in milliseconds
	const now = new Date().getTime();

	// Show the banner on any page if longer than a day ago
	if (!lastVisitDate || now - lastVisitDate > oneDay) {
	   localStorage.setItem('banner-lastSeenAt', now);
       return true;
	}
	
	// Or on the navigation pages like "Latest"
    return currentRouteName.indexOf("discovery") > -1;
  },
});
