"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function updateProfile(data: { name: string; phone: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autorizado." };

  await auth.api.updateUser({
    headers: await headers(),
    body: { name: data.name },
  });

  if (data.phone) {
    await db.user.update({
      where: { id: session.user.id },
      data: { phone: data.phone },
    });
  }

  revalidatePath("/account");
  return { success: true };
}

export async function saveAddress(data: {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  references: string;
  isDefault: boolean;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autorizado." };

  if (data.isDefault) {
    await db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  if (data.id) {
    await db.address.update({
      where: { id: data.id, userId: session.user.id },
      data: { ...data, id: undefined },
    });
  } else {
    await db.address.create({
      data: { ...data, id: undefined, userId: session.user.id },
    });
  }

  revalidatePath("/account");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autorizado." };

  await db.address.delete({
    where: { id: addressId, userId: session.user.id },
  });

  revalidatePath("/account");
  return { success: true };
}
