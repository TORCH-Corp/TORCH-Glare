import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useCallback, useState } from 'react';
import { AttachedPic, AttachmentField } from '../../../../lib'
import { convertImageFileToDataUrl } from '../../../../lib/utils/convertImageFileToDataUrl'
import { useDropzone } from 'react-dropzone';

type StoryProps = ComponentProps<typeof AttachmentField>;

const meta: Meta<StoryProps> = {
    component: AttachmentField,
    title: 'Components/Upload&Download/AttachmentField',
    argTypes: {}
};

export default meta;

type Story = StoryObj<StoryProps>;

export const AttachmentField_Playground: Story = {
    render: (args) => {

        const [imageSrc, setImageSrc] = useState<string>("");
        const onDrop = useCallback((acceptedFiles: any) => {
            convertImageFileToDataUrl(acceptedFiles[0], setImageSrc)
        }, [])
        const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

        return (
            <section >
                <AttachmentField
                    {...args}
                    getInputProps={getInputProps}
                    getRootProps={getRootProps}
                    isDropAreaActive={isDragActive}
                    mainLabel="Attach File"
                    secondaryLabel="or drag and drop"
                />
                {imageSrc && (
                    <AttachedPic
                        headerLabel="Preview"
                        src={imageSrc}
                        changeLabel="Change"
                        deleteLabel="Delete"
                        deleteButtonClick={() => {
                            setImageSrc("")
                        }}
                        changeButtonClick={() => {
                            setImageSrc("")
                        }}
                        closeButtonClick={() => {
                            setImageSrc("")
                        }}
                    />
                )}
            </section>
        );
    }
};
