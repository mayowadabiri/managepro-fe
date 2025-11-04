// components/SubscriptionForm.tsx
import React, { useEffect, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import {
  X as XIcon,
  UploadCloud as UploadIcon,
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateSubscription, useGetServices, } from "@/api/subscriptions";
import { BillingCycle, FormValues, Services, Subscription } from "@/types";
import { useForm, Controller, useWatch } from "react-hook-form";
import ServiceDropdown from "./Dropdown";
import { categories as mockCategories } from "../../utils/mockData";
import { addDays, format } from "date-fns";


const addPeriod = (start: Date, cycle: BillingCycle, multiplier = 1) => {
  const d = new Date(start.getTime());
  switch (cycle) {
    case "weekly":
      d.setDate(d.getDate() + 7 * multiplier);
      return d;
    case "monthly":
      return new Date(d.getFullYear(), d.getMonth() + 1 * multiplier, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    case "quarterly":
      return new Date(d.getFullYear(), d.getMonth() + 3 * multiplier, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    case "yearly":
      return new Date(d.getFullYear() + 1 * multiplier, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    default:
      return d;
  }
};

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (
    subscription: Omit<Subscription, "id"> & {
      id?: string;
    }
  ) => void;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  subscription,
  onCancel,
  open,
  onOpenChange,
}) => {
  const { data: services } = useGetServices();
  const { mutateAsync, isPending } = useCreateSubscription();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      service_id: subscription?.service?.id ?? undefined,
      service_name: subscription?.service?.name ?? "",
      logo: undefined,
      billing_cycle: subscription?.billingCycle ?? "monthly",
      start_date: subscription?.startDate ?? new Date(),
      next_billing_date: subscription?.nextBillingDate ?? new Date(),
      currency: subscription?.currency ?? "USD",
      amount: subscription?.amount,
      is_trial: subscription?.isTrial ?? false,
      trial_start_date: subscription?.trialStartDate ?? null,
      trial_end_date: subscription?.trialEndDate ?? null,
      trial_billing_cycle: subscription?.trialBillingCycle ?? "monthly",
      category_id: subscription?.category?.id ?? 0,
    },
    mode: "onSubmit",
  });

  const watchedValues = useWatch({ control })
  // console.log("watchedValues", watchedValues);

  // local UI state
  const [logoPreview, setLogoPreview] = useState<string | null>(subscription?.service?.imageUrl ?? null);
  const [customService, setCustomService] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(subscription?.service?.name ?? "");
  const dropdownInputRef = useRef<HTMLInputElement | null>(null);


  // UI state

  const handleServiceSelect = (service: Services) => {
    setValue("service_id", service.id, { shouldDirty: true });
    setValue("service_name", "", { shouldDirty: true });
    setValue("logo", undefined, { shouldDirty: true });
    setLogoPreview(service.imageUrl ?? null);
    setCustomService(false);
    setShowDropdown(false);
    setSearchTerm(service.name);
    clearErrors(["service_name", "logo"]); // clear any previous errors
    setTimeout(() => dropdownInputRef.current?.focus(), 0);
  };

  const handleAddCustom = () => {
    setCustomService(true);
    setShowDropdown(false);
    setValue("service_id", undefined);
    // keep whatever is in searchTerm as the starting custom name
    setValue("service_name", searchTerm || "");
    setTimeout(() => dropdownInputRef.current?.focus(), 0);
  };

  const hasFreeTrial = watch("is_trial");
  const trialStartDate = watch("trial_start_date");
  const trialBillingCycle = watch("trial_billing_cycle");
  const trialEndDate = watch("trial_end_date");
  const startDate = watch("start_date");
  const billingCycle = watch("billing_cycle");

  // File input change handler with validation (jpg/jpeg/png, <= 2MB)
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setValue("logo", undefined);
      setLogoPreview(null);
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("logo", { type: "manual", message: "Invalid file type. Only JPG/JPEG/PNG allowed." });
      setValue("logo", undefined);
      return;
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError("logo", { type: "manual", message: "File too large. Max 2MB." });
      setValue("logo", undefined);
      return;
    }

    // valid file
    clearErrors("logo");
    setValue("logo", file, { shouldDirty: true });
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  const filteredServices: Services[] =
    services?.data?.filter((s: Services) =>
      (s.name ?? "").toLowerCase().includes((searchTerm ?? "").toLowerCase())
    ) ?? [];

  useEffect(() => {
    if (hasFreeTrial && trialStartDate) {
      const computedTrialEnd = addPeriod(trialStartDate, trialBillingCycle!);
      setValue("trial_end_date", computedTrialEnd);
    } else {
      setValue("trial_end_date", null);
    }
  }, [hasFreeTrial, trialStartDate, trialBillingCycle, setValue]);

  useEffect(() => {
    if (startDate) {
      const computedNext = addPeriod(startDate, billingCycle);
      setValue("next_billing_date", computedNext);
    } else {
      setValue("next_billing_date", null);
    }
  }, [startDate, billingCycle, setValue]);


  const onFormSubmit = async (data: FormValues) => {
    // If custom service, ensure name + logo file constraints
    if (customService) {
      const name = data.service_name?.trim();
      if (!name) {
        setError("service_name", { type: "manual", message: "Service name is required for custom services." });
        return;
      }

      const file = data.logo as File | undefined;
      if (!file) {
        setError("logo", { type: "manual", message: "Please upload a logo (JPG/PNG, <=2MB) for custom services." });
        return;
      }

      const allowed = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowed.includes(file.type) || file.size > 2 * 1024 * 1024) {
        setError("logo", { type: "manual", message: "Invalid logo. JPG/PNG <= 2MB required." });
        return;
      }
    }

    const payload: any = {
      amount: typeof data.amount === "string" ? parseFloat(data.amount as any) : data.amount,
      billing_cycle: data.billing_cycle,
      category_id: Number(data.category_id),
      start_date: format(data.start_date as Date, "yyyy-MM-dd"),
      next_billing_date: format(data.next_billing_date as Date, "yyyy-MM-dd"),
      currency: data.currency,
    };

    if (customService) {
      payload.service_name = data.service_name?.trim();
      payload.logo = data.logo ?? null;
    } else {
      payload.service_id = data.service_id
    }

    if (data.is_trial) {
      payload.is_trial = data.is_trial;
      payload.free_trial_start_date = format(data.trial_start_date as Date, "yyyy-MM-dd");
      payload.free_trial_end_date = format(data.trial_end_date as Date, "yyyy-MM-dd");
      payload.free_trial_billing_cycle = data.trial_billing_cycle;
    }

    console.log("payload", payload);
    await mutateAsync(payload)
  };



  const fmt = (d?: Date | null) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <Dialog.Root open={true} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ outline: "none" }}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {subscription ? "Edit Subscription" : "Add New Subscription"}
              </h3>
              <button
                onClick={() => {
                  onCancel();
                  onOpenChange(false);
                }}
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <XIcon size={20} />
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
              {/* ----------------------------
                  TRIAL SECTION
                  ---------------------------- */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="is_trial"
                    render={({ field }) => (
                      <input
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        id="isTrial"
                        name="isTrial"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    )}
                  />

                  <label htmlFor="hasFreeTrialPeriod" className="ml-2 block text-sm font-medium text-gray-700">
                    This subscription has a free trial period
                  </label>
                </div>

                {hasFreeTrial && (
                  <div className="pl-0 md:pl-6 md:border-l-2 md:border-indigo-100 space-y-4">
                    <p className="text-sm text-gray-500">
                      Choose the trial start date and the trial billing cycle. The trial end date will be calculated automatically.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trial Start Date</label>
                        <Controller
                          control={control}
                          name="trial_start_date"
                          rules={{
                            validate: (v) => (!getValues("is_trial") ? true : !!v) || "Trial start date is required when trial is enabled",
                          }}
                          render={({ field }) => (
                            <>
                              <DatePicker
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                dateFormat="MMMM d, yyyy"
                                placeholderText="Select trial start date..."
                                wrapperClassName="w-full"
                                className="block w-full py-2.5 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              {errors.trial_start_date && (
                                <p className="mt-1 text-xs text-red-600">{errors.trial_start_date.message as string}</p>
                              )}
                            </>
                          )}
                        />
                      </div>

                      <div className="md:flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trial Billing Cycle</label>
                        <Controller
                          control={control}
                          name="trial_billing_cycle"
                          rules={{
                            validate: (v) => (!getValues("is_trial") ? true : !!v) || "Trial billing cycle is required when trial is enabled",
                          }}
                          render={({ field }) => (
                            <>
                              <select
                                {...field}
                                className="mt-1 block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                              </select>
                              {errors.trial_billing_cycle && (
                                <p className="mt-1 text-xs text-red-600">{errors.trial_billing_cycle.message as string}</p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trial End Date</label>
                      <Controller
                        control={control}
                        name="trial_end_date"
                        render={({ field }) => (
                          <input
                            readOnly
                            value={field.value ? fmt(field.value) : ""}
                            className="w-full py-2.5 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                            placeholder="Trial end date will be calculated"
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ----------------------------
                  SERVICE / NAME / LOGO (after trial)
                  ---------------------------- */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Service
                  </label>

                  <Popover.Root open={showDropdown} onOpenChange={setShowDropdown}>
                    <Popover.Trigger asChild>
                      <div
                        className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden cursor-text"
                        onClick={() => {
                          if (!customService) {
                            setShowDropdown(true);
                            setTimeout(() => dropdownInputRef.current?.focus(), 0);
                          } else {
                            setTimeout(() => dropdownInputRef.current?.focus(), 0);
                          }
                        }}
                      >
                        {/* logo preview (predefined only) */}
                        {logoPreview && !customService && (
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 p-1">
                            <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" onError={() => setLogoPreview(null)} />
                          </div>
                        )}

                        {/* TEXT INPUT (search / custom name). We manage value via searchTerm local state */}
                        <input
                          ref={(el) => (dropdownInputRef.current = el)}
                          type="text"
                          value={searchTerm}
                          onChange={(e) => {
                            const v = e.target.value;
                            setSearchTerm(v);
                            // when typing, clear any selected service_id (so user can switch)
                            setValue("service_id", undefined);
                            if (customService) {
                              // keep service_name updated if user already in custom mode
                              setValue("service_name", v, { shouldDirty: true });
                            } else {
                              // open dropdown for searches
                              setShowDropdown(true);
                            }
                          }}
                          onKeyDown={(e) => {
                            const v = (e.target as HTMLInputElement).value.trim();
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const exact = filteredServices.find((s) => s.name.toLowerCase() === v.toLowerCase());
                              if (exact) {
                                handleServiceSelect(exact);
                              } else if (v.length > 0) {
                                // create custom service
                                setCustomService(true);
                                setShowDropdown(false);
                                setValue("service_name", v, { shouldDirty: true });
                              }
                            } else if (e.key === "Escape") {
                              setShowDropdown(false);
                            }
                          }}
                          placeholder="Search or enter subscription name..."
                          className="w-full py-2.5 pl-4 pr-4 focus:outline-none text-gray-900"
                        />
                      </div>
                    </Popover.Trigger>

                    <Popover.Content
                      align="start"
                      sideOffset={4}
                      className="z-50 mt-1 bg-transparent w-[var(--radix-popover-trigger-width)]"
                      style={{ "--radix-popover-trigger-width": "100%" } as React.CSSProperties}
                    >
                      <ServiceDropdown
                        filteredServices={filteredServices}
                        handleServiceSelect={(s: Services) => {
                          handleServiceSelect(s);
                          setShowDropdown(false);
                        }}
                        onAddCustom={() => handleAddCustom()}
                      />
                    </Popover.Content>
                  </Popover.Root>

                  {customService && <p className="mt-1 text-xs text-gray-500">You're adding a custom subscription service.</p>}
                </div>

                {/* Logo area */}
                {customService ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo (upload JPG/PNG, max 2MB)</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" onError={() => setLogoPreview(null)} />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          id="logo-file"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleLogoFileChange}
                          className="block w-full text-sm"
                        />
                        {errors.logo && <p className="mt-1 text-xs text-red-600">{(errors.logo as any).message}</p>}
                        <p className="mt-1 text-xs text-gray-500">Upload a JPG/PNG image (optional) — max 2MB.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" onError={() => setLogoPreview(null)} />
                        ) : (
                          <UploadIcon size={24} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>


              {/* Amount & Billing Cycle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>

                  <div className="flex gap-3">
                    {/* ===== Amount Input ===== */}
                    <div className="relative flex-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>

                      <Controller
                        name="amount"
                        control={control}
                        rules={{ required: "Amount is required" }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            id="amount"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md border"
                            placeholder="0.00"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* ===== Currency Select ===== */}
                    <div className="w-28">
                      <Controller
                        name="currency"
                        control={control}
                        rules={{ required: "Currency is required" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="currency"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md text-sm"
                          >
                            <option value="NGN">NGN</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                        )}
                      />
                    </div>
                  </div>

                  {errors.amount && (
                    <p className="mt-1 text-xs text-red-600">{errors.amount.message as string}</p>
                  )}
                  {errors.currency && (
                    <p className="mt-1 text-xs text-red-600">{errors.currency.message as string}</p>
                  )}
                </div>



                <div>
                  <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                  <select
                    {...register("billing_cycle", { required: "Billing cycle is required" })}
                    id="billingCycle"
                    name="billingCycle"
                    className="mt-1 block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  {errors.billing_cycle && <p className="mt-1 text-xs text-red-600">{errors.billing_cycle.message as string}</p>}
                </div>
              </div>

              {/* Category single-select (Radix Select) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>

                <Controller
                  control={control}
                  name="category_id"
                  render={({ field }) => {

                    return (
                      <Select.Root
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val: string) => {
                          // keep a plain string value (no arrays) to avoid render loops
                          field.onChange(val);
                        }}
                      >
                        <Select.Trigger
                          className="inline-flex items-center justify-between w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          aria-label="Category"
                        >
                          <Select.Value placeholder="Select a category..." />
                          <Select.Icon className="ml-2">
                            <ChevronDownIcon size={16} className="text-gray-400" />
                          </Select.Icon>
                        </Select.Trigger>

                        <Select.Portal>
                          <Select.Content
                            className="z-50 mt-1 w-[var(--radix-select-trigger-width)] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                            style={{ "--radix-select-trigger-width": "100%" } as React.CSSProperties}
                          >
                            <Select.Viewport className="py-1">
                              {mockCategories.map((cat) => (
                                <Select.Item
                                  key={cat.id}
                                  value={String(cat.id)} // keep this as string
                                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                >
                                  <Select.ItemText>{cat.name}</Select.ItemText>
                                  <Select.ItemIndicator>
                                    <CheckIcon size={16} className="text-indigo-600" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    );
                  }}
                />


                <p className="mt-1 text-xs text-gray-500">Select the category that best describes this subscription</p>
              </div>

              {/* Dates: Start & Next Billing (main) */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:flex-1">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <Controller
                    control={control}
                    name="start_date"
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="MMMM d, yyyy"
                          placeholderText="Select start date..."
                          wrapperClassName="w-full"
                          className="block w-full py-2.5 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          minDate={trialEndDate ? addDays(trialEndDate, 1) : undefined}
                        />
                        {errors.start_date && <p className="mt-1 text-xs text-red-600">{errors.start_date.message as string}</p>}
                      </>
                    )}
                  />
                </div>

                <div className="md:flex-1">
                  <label htmlFor="nextBillingDate" className="block text-sm font-medium text-gray-700 mb-1">Next Billing Date</label>
                  <Controller
                    control={control}
                    name="next_billing_date"
                    render={({ field }) => (
                      <input
                        readOnly
                        value={field.value ? fmt(field.value) : ""}
                        className="w-full py-2.5 px-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                        placeholder="Next billing date will be calculated"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Footer actions */}
              <div className="pt-4 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    onCancel();
                    onOpenChange(false);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 cursor-pointer py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 order-1 sm:order-2"
                >
                  {subscription ? "Update" : "Add"} Subscription
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SubscriptionForm;
