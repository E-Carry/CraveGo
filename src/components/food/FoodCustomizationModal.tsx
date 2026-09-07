import React, { useState, useMemo } from 'react';
import { FoodItem, SelectedCustomization } from '../../types';
import { X, Check, Plus, Minus, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

interface FoodCustomizationModalProps {
  foodItem: FoodItem | null;
  restaurantName: string;
  onClose: () => void;
}

export const FoodCustomizationModal: React.FC<FoodCustomizationModalProps> = ({
  foodItem,
  restaurantName,
  onClose
}) => {
  const { addToCart } = useCart();
  const { playClick, playAdd } = useAudio();

  const [quantity, setQuantity] = useState(1);

  // Initialize selected choices from defaults
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    if (!foodItem || !foodItem.customizations) return {};
    const init: Record<string, string[]> = {};
    foodItem.customizations.forEach(grp => {
      const defaultChoice = grp.choices.find(c => c.isDefault);
      if (defaultChoice) {
        init[grp.id] = [defaultChoice.id];
      } else if (grp.type === 'single' && grp.choices.length > 0) {
        init[grp.id] = [grp.choices[0].id];
      } else {
        init[grp.id] = [];
      }
    });
    return init;
  });

  const handleSelectSingle = (groupId: string, choiceId: string) => {
    playClick();
    setSelections(prev => ({
      ...prev,
      [groupId]: [choiceId]
    }));
  };

  const handleToggleMultiple = (groupId: string, choiceId: string, maxSelections?: number) => {
    playClick();
    setSelections(prev => {
      const current = prev[groupId] || [];
      if (current.includes(choiceId)) {
        return { ...prev, [groupId]: current.filter(id => id !== choiceId) };
      } else {
        if (maxSelections && current.length >= maxSelections) {
          return prev;
        }
        return { ...prev, [groupId]: [...current, choiceId] };
      }
    });
  };

  // Calculate pricing breakdown
  const { extraTotal, selectedCustomizationList } = useMemo(() => {
    let extra = 0;
    const list: SelectedCustomization[] = [];

    if (foodItem && foodItem.customizations) {
      foodItem.customizations.forEach(grp => {
        const chosenIds = selections[grp.id] || [];
        if (chosenIds.length > 0) {
          const chosenChoices = grp.choices.filter(c => chosenIds.includes(c.id));
          const grpExtra = chosenChoices.reduce((s, c) => s + c.price, 0);
          extra += grpExtra;

          list.push({
            groupId: grp.id,
            groupName: grp.name,
            choiceIds: chosenIds,
            choiceNames: chosenChoices.map(c => c.name),
            extraPrice: grpExtra
          });
        }
      });
    }

    return { extraTotal: extra, selectedCustomizationList: list };
  }, [foodItem, selections]);

  if (!foodItem) return null;

  const unitPrice = Number((foodItem.price + extraTotal).toFixed(2));
  const finalTotal = Number((unitPrice * quantity).toFixed(2));

  const handleConfirm = () => {
    addToCart(foodItem, selectedCustomizationList, quantity, restaurantName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Photo & Close */}
        <div className="relative h-44 sm:h-48 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-dark-surface">
          <img
            src={foodItem.image}
            alt={foodItem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
              Customize Your Dish
            </span>
            <h3 className="text-xl font-black font-display">{foodItem.name}</h3>
            <span className="text-sm font-semibold opacity-90">
              Base: ${foodItem.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Scrollable Customization Groups */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {foodItem.customizations?.map(group => {
            const isSingle = group.type === 'single';
            const selectedIds = selections[group.id] || [];

            return (
              <div
                key={group.id}
                className="pb-4 border-b border-slate-100 dark:border-white/5 last:border-none"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {group.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {isSingle
                        ? group.required
                          ? 'Select 1 (Required)'
                          : 'Select 1'
                        : group.maxSelections
                        ? `Select up to ${group.maxSelections}`
                        : 'Select multiple'}
                    </span>
                  </div>

                  {group.required && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 uppercase">
                      Required
                    </span>
                  )}
                </div>

                {/* Choices list */}
                <div className="space-y-2 mt-3">
                  {group.choices.map(choice => {
                    const isSelected = selectedIds.includes(choice.id);

                    return (
                      <div
                        key={choice.id}
                        onClick={() => {
                          if (isSingle) {
                            handleSelectSingle(group.id, choice.id);
                          } else {
                            handleToggleMultiple(group.id, choice.id, group.maxSelections);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500 text-slate-900 dark:text-white'
                            : 'border-slate-200/80 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio / Checkbox Indicator */}
                          <div
                            className={`w-5 h-5 rounded-${
                              isSingle ? 'full' : 'lg'
                            } border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-brand-500 bg-brand-500 text-white'
                                : 'border-slate-300 dark:border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <span className="text-xs sm:text-sm font-semibold">
                            {choice.name}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {choice.price > 0 ? `+$${choice.price.toFixed(2)}` : 'Free'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Quantity & Add CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-dark-surface/60 flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10">
            <button
              onClick={() => {
                playClick();
                setQuantity(q => Math.max(1, q - 1));
              }}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => {
                playClick();
                setQuantity(q => q + 1);
              }}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-between shadow-xl shadow-brand-500/25 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Add to Order</span>
            </div>
            <span>${finalTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
