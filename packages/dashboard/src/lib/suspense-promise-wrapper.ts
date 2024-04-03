/**
 * promiseWrapper allows us to wrap a promise in a way that we can use it with React Suspense
 * */
export function promiseWrappper<T, E = Error>(promise: Promise<T>){
    let status = "pending";
    let result: T | E

    const suspender = promise.then(
        (res) => {
            status = "success";
            result = res;
        },
        (err) => {
            status = "error";
            result = err;
        }
    )

    return {
        read(){
            if(status === "pending") throw suspender;
            if(status === "error") throw result;
            if(status === "success") return result;
        }
    }
}