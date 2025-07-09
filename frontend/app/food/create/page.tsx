// frontend/app/food/create/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CreateFoodClient = dynamic(
    () => import('./CreateFoodClient'),
    { ssr: false }
);

export default function Page() {
    return (
        <Suspense fallback={<p>Loading…</p>}>
            <CreateFoodClient />
        </Suspense>
    );
}
