import { useState } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { updateDraftField } from '../features/interaction/interactionSlice';
import { Interaction } from '../types';

export const useDraftAutosave = () => {
  const dispatch = useAppDispatch();
  const { currentDraft } = useAppSelector(state => state.interaction);
  const [saveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');

  const handleFieldChange = (field: keyof Interaction, value: any) => {
    if (!currentDraft) return;
    dispatch(updateDraftField({ [field]: value }));
  };

  return { handleFieldChange, saveStatus };
};
