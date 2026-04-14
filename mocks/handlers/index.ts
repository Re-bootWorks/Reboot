import { meetingsHandlers } from "./meetings";
import { authHandlers } from "./auth";
import { usersHandlers } from "./users";
import { reviewsHandlers } from "./reviews";
import { postsHandlers } from "./posts";
import { notificationsHandlers } from "./notifications";
import { favoritesHandlers } from "./favorites";

const handlers = [
	...authHandlers,
	...usersHandlers,
	...meetingsHandlers,
	...reviewsHandlers,
	...postsHandlers,
	...notificationsHandlers,
	...favoritesHandlers,
];
export default handlers;
