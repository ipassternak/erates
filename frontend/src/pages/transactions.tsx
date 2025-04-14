import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button, Form, Input, Modal, Select } from "antd";

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

export const TransactionsPage = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1);

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
        <Form layout="vertical" onFinish={(values) => console.log(values)}>
          <Form.Item label="Exchange Rate">
            <Input type="number" placeholder="Exchange Rate" />
          </Form.Item>

          <Form.Item label="From Wallet">
            <Select options={mockedOptions} />
          </Form.Item>

          <Form.Item label="To Wallet">
            <Select options={mockedOptions} />
          </Form.Item>

          <Form.Item label="Amount">
            <Input type="number" placeholder="Amount" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Transfer
          </Button>
        </Form>
      </Modal>
    </>
  );
};
