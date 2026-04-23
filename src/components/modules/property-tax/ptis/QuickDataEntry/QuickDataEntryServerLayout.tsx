import { QuickDataEntryClientWrapper } from './QuickDataEntryClientWrapper';

interface Props {
    children: React.ReactNode;
}

export async function QuickDataEntryServerLayout({
    children
}: Props) {

    return (
        <QuickDataEntryClientWrapper>
            {children}
        </QuickDataEntryClientWrapper>
    );
}