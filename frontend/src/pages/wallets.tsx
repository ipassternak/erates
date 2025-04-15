import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Button, Form, Input, Modal, Select } from "antd";
import { API_URL, currencyOptions } from "../const";

interface WalletFormValues {
  name: string;
  currency: string;
}

export const WalletsPage = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/wallets/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.text())
      .then((html) => {
        setHtmlContent(DOMPurify.sanitize(html));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching wallets:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading wallets...</div>;

  return (
    <>
      <div className="transactions-container">
        <Button onClick={() => setOpen(true)}>New Wallet</Button>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
      <Modal
        title="New Wallet"
        open={open}
        footer={null}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <Form<WalletFormValues>
          layout="vertical"
          onFinish={(values) => console.log(values)}
        >
          <Form.Item<WalletFormValues>
            label="Wallet Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<WalletFormValues>
            label="Wallet Currency"
            name="currency"
            rules={[{ required: true }]}
          >
            <Select options={currencyOptions} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
