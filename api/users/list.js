import base from '../base'
import {success, fail} from '../api_response'

class UserList {

    static user_list = async (payload ) => {
        let promise = await base.GET({
            slug: 'users/list/',
            payload: payload,
            headers: {},
            success: (data) => success(data),
            fail: (err) => fail(err)
        })

        return promise
    }

}

export default UserList