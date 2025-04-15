import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
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

  useEffect(() => {
    fetch(`${API_URL}/transactions/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.text())
      .then((html) => {
        setHtmlContent(DOMPurify.sanitize(html));
        setLoading(false);
      });
  }, []);

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
          onFinish={(values) => console.log(values)}
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
