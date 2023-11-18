import classNames from "classnames/bind";
import styles from'./button.module.scss'
import { Link } from "react-router-dom";

const cx = classNames.bind(styles)

let Element = 'a'
function Button( {children, type,to, ...allProps} ) {
    let BUTTON_TYPES = {
        primary: true,
        [type]:type, //solid or outline
    }
    if(to) {
        Element = Link
    } 
    
    return ( 
        <Element className={cx(BUTTON_TYPES)} to = {to} {...allProps}>
            {children}
            
        </Element>
     );
}

export default Button;