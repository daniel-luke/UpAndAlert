import {UserService} from "~~/server/modules/auth/services/User";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body) {
        setResponseStatus(event, 400);
        return {
            statusCode: 400,
            message: "missing body"
        }
    }

    if (!body.username || !body.password) {
        setResponseStatus(event, 400);
        return {
            statusCode: 400,
            message: "missing username or password"
        }
    }

    return UserService.getInstance().login(body.username, body.password);

})
