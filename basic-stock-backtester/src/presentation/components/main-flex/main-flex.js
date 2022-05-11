import MainSection from './main-flex.elements.js'

const MainFlex = ({children}) => {
    return ( 
        <>
        <MainSection id="Main-Flex">{children}</MainSection>
        </>
     );
}
 
export default MainFlex;