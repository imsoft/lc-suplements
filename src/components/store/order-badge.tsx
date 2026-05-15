const ORDER_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-yellow-500/10 text-yellow-700" },
  CONFIRMED: { label: "Confirmado", className: "bg-blue-500/10 text-blue-700" },
  PROCESSING: { label: "En proceso", className: "bg-blue-500/10 text-blue-700" },
  SHIPPED: { label: "Enviado", className: "bg-purple-500/10 text-purple-700" },
  DELIVERED: { label: "Entregado", className: "bg-green-500/10 text-green-700" },
  CANCELLED: { label: "Cancelado", className: "bg-red-500/10 text-red-700" },
  REFUNDED: { label: "Reembolsado", className: "bg-gray-500/10 text-gray-700" },
};

const PAYMENT_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pago pendiente", className: "bg-yellow-500/10 text-yellow-700" },
  PAID: { label: "Pagado", className: "bg-green-500/10 text-green-700" },
  FAILED: { label: "Pago fallido", className: "bg-red-500/10 text-red-700" },
  REFUNDED: { label: "Reembolsado", className: "bg-gray-500/10 text-gray-700" },
};

interface BadgeProps {
  status: string;
  type?: "order" | "payment";
}

export function Badge({ status, type = "order" }: BadgeProps) {
  const map = type === "payment" ? PAYMENT_STATUS_LABELS : ORDER_STATUS_LABELS;
  const config = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
