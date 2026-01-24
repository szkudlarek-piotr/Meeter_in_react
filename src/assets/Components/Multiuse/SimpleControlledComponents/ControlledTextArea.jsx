import styled from "styled-components";

const StyledTextarea = styled.textarea`
    height: ${({ height }) => height || "200px"};
    font-size: 14px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
`;

export default function ControlledTextArea({
    fieldValue,
    changeFieldValue,
    placeholderValue,
    id,
    height
}) {
    return (
        <StyledTextarea
            id={id}
            value={fieldValue}
            placeholder={placeholderValue}
            height={height}
            onChange={(e) => changeFieldValue(e.target.value)}
        />
    );
}
