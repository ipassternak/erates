import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button, Form, InputNumber, Modal, Select } from "antd";

const mockedOptions = [
  {
    label: "USD",
    value: "USD",
  },
  {
    label: "EUR",
    value: "EUR",
  },
  {
    label: "UAH",
    value: "UAH",
  },
];

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
    fetch("/transactions")
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
      >
        <Form<TransactionFormValues>
          layout="vertical"
          onFinish={(values) => console.log(values)}
        >
          <Form.Item<TransactionFormValues>
            label="Exchange Rate"
            name="exchangeRate"
          >
            <InputNumber type="number" placeholder="Exchange Rate" />
          </Form.Item>

          <Form.Item<TransactionFormValues>
            label="From Wallet"
            name="fromWallet"
          >
            <Select options={mockedOptions} />
          </Form.Item>

          <Form.Item<TransactionFormValues> label="To Wallet" name="toWallet">
            <Select options={mockedOptions} />
          </Form.Item>

          <Form.Item<TransactionFormValues> label="Amount" name="amount">
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
