import { useCallback, useEffect, useState } from "react";
import { Button, Form, InputNumber, Modal, Select } from "antd";
import { API_URL, currencyOptions } from "../const";

interface TransactionFormValues {
  exchangeRate: number;
  fromWallet: string;
  toWallet: string;
  amount: number;
}

export const TransactionsPage = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchTransactions = useCallback(() => {
    fetch(`${API_URL}/transactions/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.text())
      .then((html) => {
        setHtmlContent(html);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = (values: TransactionFormValues) => {
    fetch(`${API_URL}/transactions/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        from_wallet_id: values.fromWallet,
        to_wallet_id: values.toWallet,
        amount: values.amount,
        exchange_rate_id: String(values.exchangeRate),
      }),
    })
      .then(() => {
        setOpen(false);
        fetchTransactions();
      })
      .catch((error) => console.error(error));
  };

  if (loading) return <div>Loading transactions...</div>;

  return (
    <>
      <div className="transactions-container">
          <Button onClick={() => setOpen(true)}>New Transaction</Button>
          
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
      <Modal
        title="New Transaction"
        open={open}
        footer={null}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <Form<TransactionFormValues>
          layout="vertical"
          onFinish={createTransaction}
        >
          <Form.Item<TransactionFormValues>
            label="Exchange Rate"
            name="exchangeRate"
            rules={[{ required: true }]}
          >
            <InputNumber type="number" placeholder="Exchange Rate" />
          </Form.Item>

          <Form.Item<TransactionFormValues>
            label="From Wallet"
            name="fromWallet"
            rules={[{ required: true }]}
          >
            <Select options={currencyOptions} />
          </Form.Item>

          <Form.Item<TransactionFormValues>
            label="To Wallet"
            name="toWallet"
            rules={[{ required: true }]}
          >
            <Select options={currencyOptions} />
          </Form.Item>

          <Form.Item<TransactionFormValues>
            label="Amount"
            name="amount"
            rules={[{ required: true }]}
          >
            <InputNumber type="number" placeholder="Amount" />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Transfer
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
