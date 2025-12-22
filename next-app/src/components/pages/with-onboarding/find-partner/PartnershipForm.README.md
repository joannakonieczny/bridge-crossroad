# PartnershipForm Component

## Overview
`PartnershipForm` is a React component that allows users to create or modify partnership post announcements. It supports both "create" and "modify" modes.

## Props

```typescript
type PartnershipFormProps = {
  mode?: "create" | "modify";           // Defaults to "create"
  partnershipPostId?: string;           // Required when mode is "modify"
  initialData?: AddPartnershipPostSchemaType;  // Pre-populate form in modify mode
  isOpen?: boolean;                     // Control modal visibility externally
  onClose?: () => void;                 // Handle modal close externally
};
```

## Usage Examples

### Create Mode (Default)
This is the simplest usage - just renders a button that opens the form modal.

```tsx
import PartnershipForm from "@/components/pages/with-onboarding/find-partner/PartnershipForm";

export default function MyComponent() {
  return (
    <div>
      <PartnershipForm />
    </div>
  );
}
```

### Modify Mode (Controlled)
For editing existing partnership posts, you need to:
1. Set `mode="modify"`
2. Provide the `partnershipPostId`
3. Optionally provide `initialData` to pre-populate the form
4. Control the modal visibility with `isOpen` and `onClose`

```tsx
import { useState } from "react";
import { Button, useDisclosure } from "@chakra-ui/react";
import PartnershipForm from "@/components/pages/with-onboarding/find-partner/PartnershipForm";
import { BiddingSystem, PartnershipPostType } from "@/club-preset/partnership-post";

export default function EditPartnershipExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Example initial data from your partnership post
  const partnershipPostData = {
    name: "Szukam partnera na turniej",
    description: "Preferuję system WJ",
    biddingSystem: BiddingSystem.COMMON_LANGUAGE,
    groupId: "group-123",
    data: {
      type: PartnershipPostType.PERIOD,
      duration: {
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2024-01-31"),
      },
    },
  };

  return (
    <div>
      <Button onClick={onOpen}>Edytuj ogłoszenie</Button>
      
      <PartnershipForm
        mode="modify"
        partnershipPostId="post-123"
        initialData={partnershipPostData}
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
}
```

### Example: Edit Button in Announcement Component
Here's how you might integrate it into an existing announcement:

```tsx
import { useDisclosure } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import PartnershipForm from "@/components/pages/with-onboarding/find-partner/PartnershipForm";

export default function AnnouncementCard({ post }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <div>
      <h3>{post.name}</h3>
      <p>{post.description}</p>
      
      {post.isOwnByUser && (
        <>
          <button onClick={onOpen}>
            <FiEdit /> Edytuj
          </button>
          
          <PartnershipForm
            mode="modify"
            partnershipPostId={post.id}
            initialData={{
              name: post.name,
              description: post.description,
              biddingSystem: post.biddingSystem,
              groupId: post.groupId,
              data: post.data,
            }}
            isOpen={isOpen}
            onClose={onClose}
          />
        </>
      )}
    </div>
  );
}
```

## Features

- **Create Mode**: Opens modal with empty form to create new partnership post
- **Modify Mode**: Opens modal with pre-populated data to edit existing post
- **Validation**: Uses zod schema validation for both modes
- **Toast Notifications**: Shows loading, success, and error messages
- **i18n Support**: All text is translated (Polish translations in `messages/pl.ts`)
- **Type Safety**: Full TypeScript support with proper type inference

## API Integration

The component uses these API actions:
- `createPartnershipPost` - for creating new posts
- `modifyPartnershipPost` - for updating existing posts

Both are defined in `/services/find-partner/api.ts`

## Translations

Translation keys in `messages/pl.ts` under `findPartner.PartnershipForm`:
- `modalHeader` - "Nowe ogłoszenie poszukiwania partnera"
- `modalHeaderModify` - "Edytuj ogłoszenie"
- `createButton` - "Utwórz ogłoszenie"
- `modifyButton` - "Zapisz zmiany"
- `toast.loading` / `toast.modify.loading` - Loading messages
- `toast.success` / `toast.modify.success` - Success messages

## Implementation Notes

- Form uses `react-hook-form` with `zod` resolver
- Different schemas for create (`addPartnershipPostSchema`) and modify (`modifyPartnershipPostSchema`)
- Automatically invalidates query cache on successful submit
- Uses `useEffect` to reset form when mode/initialData changes
