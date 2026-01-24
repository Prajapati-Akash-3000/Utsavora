export default function PaymentTable() {
  const payments = [
    {
      id: 1,
      amount: 5000,
      type: "ESCROW_ADVANCE",
      status: "SUCCESS",
    },
  ];

  return (
    <table className="w-full bg-white shadow rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Amount</th>
          <th className="p-3">Type</th>
          <th className="p-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-3">₹{p.amount}</td>
            <td className="p-3">{p.type}</td>
            <td className="p-3">{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
