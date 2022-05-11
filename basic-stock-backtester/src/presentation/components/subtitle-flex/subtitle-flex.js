import {
    SubtitleContainer
} from './subtitle-flex.elements'
const SubtitleFlex = ({children}) => {
    return (
        <>
            <SubtitleContainer>{children}</SubtitleContainer>
        </>
    );
}

export default SubtitleFlex;