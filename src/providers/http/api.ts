import Cookie from "../storage/cookie";

interface Http {
    (url: string, object?: any): Promise<JSON | any>
}

/**
 * [someFunction description]
 * @param  {[type]} arg1 [description]
 * @param  {[type]} arg2 [description]
 * @return {[type]}      [description]
 */
interface ApiType {
    get: Http;
    post: Http;
    put?: Http;
    delete: Http;
    auth: <JSON = any>(url: string, object: any) => Promise<JSON>;
    signOut: () => Promise<void>;
}


function fetchApi():ApiType {

    return {

        get: async (url: string, object?: any): Promise<JSON | any> => {
        
            const response = await fetch(url + `${ object ? `?${new URLSearchParams(object)}` : ''}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${await Cookie.get('auth')}`,
                },
            })
            return await response.json()
              
        },
        
        post: async (url: string, object: any): Promise<JSON | any> => {
                
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${await Cookie.get('auth')}`,
                },
                body: JSON.stringify(object)
            })
            return await response.json()
        },
        // put: async (url: string, object: any): Promise<JSON | any> => {
    
        // }
        
        delete: async (url: string, object?: any): Promise<JSON | any> => {
                
            const response = await fetch(url + `${ object ? `?${new URLSearchParams(object)}` : ''}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${await Cookie.get('auth')}`,
                },
            })
            return response.status === 204 ? response : await response.json()
        },
    
        auth: async (url: string, object: any,): Promise<JSON | any> => {
    
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(object)
            })
            const data = await response.json()
            await Cookie.set('auth', data.accessToken, 360)
            await Cookie.set('user', JSON.stringify(data.user), 360)
            return data
        },
    
        signOut: async(): Promise<void> => {
            try{
    
                await Cookie.expire('auth')
                await Cookie.expire('auth')
                if(typeof window !== 'undefined') window.location.reload()
    
            } catch(err){
    
                console.log('An error occurred when logging out: ', err)
                if(typeof window !== 'undefined') window.location.reload()
    
            }
        }

    }
}

/**
 * `Api` is a fetch factory that provide simple http methods.
 * 
 * It used the same API RESTful design pattern.
 *
 * ```js
 * await Api.post('www.example.products', { name:'table' })
 * // { id:1, name: 'table' }, 
 * 
 * await Api.get('www.example.users/')
 * //[ { name: 'John Doe' },  { name: 'Gabriel Henrique' } ]
 * 
 * await Api.get('www.example.products', { id:1 })
 * // { name: 'Gabriel Henrique' }, 
 * 
 * await Api.delete('www.example.products', { id: 1 })
 * //    { id:1, name:'table' }
 * ```
 *
 * See `www.google.com` for more information.
 * @since v0.1 by [`Gabriel henrique`](https://github.com/gab-h3nrique)
 */
const Api = fetchApi()

export default Api
