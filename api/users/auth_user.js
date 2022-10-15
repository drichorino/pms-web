import base from '../base'
import {success, fail} from '../api_response'

class User {

    static login = async (payload ) => {
        let promise = await base.POST({
            slug: 'login/',
            payload: payload,
            headers: {},
            success: (data) => success(data),
            fail: (err) => fail(err)
        })

        return promise
    }

    static logout = async () => {
        let promise = await base.POST({
            slug: 'logout/',
            payload: {},
            headers: {},
            success: (data) => success(data),
            fail: (err) =>  fail(err)
        })
        
        return promise
    }


}

export default User