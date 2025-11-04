// src/types/user.ts

interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
};

interface Services {
  id: number;
  name: string;
  domain: string;
  createdAt: string;
  uuid: string;
  isPredefined: boolean;
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
}

type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";

enum Status {
  ACTIVE = "active",
  INACTIVE = "to_expire",
  CANCELLED = "expired",
}

interface Subscription {
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  status: Status;
  startDate: Date; // ISO date (e.g. "2025-10-02")
  nextBillingDate: Date; // ISO date (e.g. "2025-11-02")
  trialEndDate: Date | null;
  trialStartDate: Date | null;
  trialBillingCycle?: BillingCycle;
  isTrial?: boolean;
  category: Category;
  id: number;
  user: number;
  trialEndDay: number;
  uuid: string;
  service: Services;
}
interface Category {
  id: number;
  name: string;
}

type FormValues = {
  service_id?: number;
  service_name?: string;
  logo?: File;
  billing_cycle: BillingCycle;
  start_date: Date;
  next_billing_date: Date | null;
  currency: string;
  amount: number;
  is_trial?: boolean;
  trial_start_date?: Date | null;
  trial_end_date?: Date | null;
  trial_billing_cycle?: BillingCycle;
  category_id: number;
};

export {
  type CreateUser,
  type User,
  type Services,
  type Category,
  type Subscription,
  type FormValues,
  Status,
  type BillingCycle,
};
