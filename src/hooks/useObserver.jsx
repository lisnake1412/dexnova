import { useEffect, useRef } from "react"


function useObserver(callback, props, Component) {
    const observer = useRef('')
    useEffect((callback, props, Component) => {
        observer.current = new IntersectionObserver( (entries) => {
            const entry = entries[0]
            if(entry.isIntersecting) {
                callback()
            }
        } , props)
        observer.current.observe(Component)
    },[])
   
    return ( 0 );
}

export default useObserver;