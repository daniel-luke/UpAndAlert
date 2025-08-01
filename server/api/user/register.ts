import {UserService} from "~~/server/modules/auth/services/User";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body) {
        throw createError({
            statusCode: 400,
            message: 'Missing request body',
        })
    }

    if (!body.username || !body.name || !body.email || !body.password) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields',
        })
    }

    return await UserService.getInstance().createUser(body.username, body.name, body.email, body.password)
        .then(() => {
            setResponseStatus(event, 201);
            return;
        })
        .catch(() => {
            setResponseStatus(event, 400);
            return {
                statusCode: 400,
                message: 'User already exists'
            };
    });
})
