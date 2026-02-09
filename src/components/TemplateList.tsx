import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Tag, Button } from 'antd';
import { templates, type Template } from '../data/templates';
import './TemplateList.css';

const { Meta } = Card;

const COVER_HEIGHT = 200;

export default function TemplateList() {
  return (
    <section className="template-list-section">
      <div className="template-header">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}

        >
          Choose Your Template
        </motion.h2>
       
      </div>

      <Row gutter={[24, 24]} justify="center">
        {templates.map((template, i) => (
          <Col xs={24} sm={12} lg={6} key={template.id}>
            <TemplateCard template={template} index={i} />
          </Col>
        ))}
      </Row>
    </section>
  );
}

interface TemplateCardProps {
  template: Template;
  index: number;
}

function TemplateCard({ template, index }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      style={{ height: '100%' }}
    >
      <Card
        hoverable
   
       
        cover={
          template.video ? (
            <video
              src={template.video}
              autoPlay
              loop
              muted
              playsInline
              draggable={false}
              style={{ width: '100%', height: COVER_HEIGHT, objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: COVER_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', background: '#f5f5f5' }}>
              {template.emoji}
            </div>
          )
        }
      >
        <Tag color="purple" style={{ marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          {template.category}
        </Tag>
        <Meta
          title={template.name}
          description={template.description}
          style={{paddingBottom: '16px'}}
        />
        <Link to={`/template/${template.id}`} style={{ marginTop: 'auto', paddingTop: 16 }}>
          <Button variant='solid' block shape="round" color='pink'>
            Use Template
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
