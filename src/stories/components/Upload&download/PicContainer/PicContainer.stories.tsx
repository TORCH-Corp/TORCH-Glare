import { Meta, StoryObj } from '@storybook/react';
import { ChangeEvent, ComponentProps, useState } from 'react';
import { AttachedPic, PicContainer } from '@/index'
import { convertImageFileToDataUrl } from '@utils/convertImageFileToDataUrl'

type StoryProps = ComponentProps<typeof PicContainer>;

const meta: Meta<StoryProps> = {
    component: PicContainer,
    title: 'Components/Upload&Download/PicContainer',
    argTypes: {}
};

export default meta;

type Story = StoryObj<StoryProps>;

export const PicContainer_Playground: Story = {
    render: (args) => {
        const [imageSrc, setImageSrc] = useState<string>("");
        const [imagePreviewActive, setImagePreviewActive] = useState<boolean>(false);

        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0] ?? null;
            convertImageFileToDataUrl(file, setImageSrc);
        };

        return (
            <section className="attachment-wrapper">
                <PicContainer
                    {...args}
                    onChange={handleFileChange}
                    id="test"
                    selectedImg={imageSrc}
                    ExpandImageClick={() => setImagePreviewActive(true)}
                />
                {imagePreviewActive && (
                    <AttachedPic
                        headerLabel="Preview"
                        src={imageSrc}
                        changeLabel="Change"
                        deleteLabel="Delete"
                        deleteButtonClick={() => {
                            setImageSrc("")
                            setImagePreviewActive(false)
                        }}
                        changeButtonClick={() => {
                            setImageSrc("")
                            setImagePreviewActive(false)
                        }}
                        closeButtonClick={() => {
                            setImagePreviewActive(false)
                        }
                        }
                    />
                )}
            </section>
        );
    }
};
