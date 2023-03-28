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

  @discourseComputed("router.currentRouteName", "router.currentURL", "currentUser")
  discoveryRoute(currentRouteName, currentURL, currentUser) {
	if (currentUser.first_seen_at) {
	    const minutesDiff = (Date.now() - currentUser.first_seen_at) / 60000;
		if (minutesDiff <= 1) {
			return true;
		}
	}
    return currentRouteName.indexOf("discovery") > -1;
  },
});
