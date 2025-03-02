"use client"; // Mark this as a Client Component if using Next.js 13+
import { CopyBlock } from 'react-code-blocks';
import { ComponentProps } from "react";

const vscodeTheme = {
    lineNumberColor: '#858585',
    lineNumberBgColor: '#1e1e1e',
    backgroundColor: 'transparent', // Use CSS variable
    textColor: '#d4d4d4',
    substringColor: '#d4d4d4',
    keywordColor: '#569cd6',
    attributeColor: '#9cdcfe',
    selectorTagColor: '#569cd6',
    docTagColor: '#d4d4d4',
    nameColor: '#569cd6',
    builtInColor: '#569cd6',
    literalColor: '#569cd6',
    bulletColor: '#d4d4d4',
    codeColor: '#d4d4d4',
    additionColor: '#d4d4d4',
    regexpColor: '#d4d4d4',
    symbolColor: '#d4d4d4',
    variableColor: '#9cdcfe',
    templateVariableColor: '#9cdcfe',
    linkColor: '#569cd6',
    selectorAttributeColor: '#d4d4d4',
    selectorPseudoColor: '#d4d4d4',
    typeColor: '#4ec9b0',
    stringColor: '#ce9178',
    selectorIdColor: '#d4d4d4',
    selectorClassColor: '#d4d4d4',
    quoteColor: '#d4d4d4',
    templateTagColor: '#d4d4d4',
    deletionColor: '#d4d4d4',
    titleColor: '#d4d4d4',
    sectionColor: '#d4d4d4',
    commentColor: '#6a9955',
    metaKeywordColor: '#d4d4d4',
    metaColor: '#d4d4d4',
    functionColor: '#dcdcaa',
    numberColor: '#b5cea8',
};


interface Props extends ComponentProps<typeof CopyBlock> {
    code: any
    language: string
    showLineNumbers: boolean
}

export const Codeblock: React.FC<Partial<Props>> = ({ showLineNumbers, language = "tsx", code, ...props }) => {


    return (
        <CopyBlock
            {...props} // Allow dynamic props usage
            text={code}
            language={language}
            showLineNumbers={showLineNumbers}
            theme={vscodeTheme}
            customStyle={{ padding: '16px', backgroundColor: 'var(--background-presentation-form-field-primary)', borderRadius: '6px', overflow: "hidden" }}
        />
    );
};


