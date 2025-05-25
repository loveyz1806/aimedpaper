# 论文详情页改进说明

## 改进内容

### 1. 标签化显示
将论文详情页中的关键词、作者信息和机构信息从原始文本显示改为独立的标签（Badge）显示形式。

### 2. 智能文本分割
实现了智能文本分割函数 `smartSplit`，能够根据不同类型的信息使用不同的分割规则：

- **关键词**: 使用逗号、分号、中英文标点符号和换行符分割
- **作者信息**: 除了基本分隔符外，还支持 "and" 连接词
- **机构信息**: 使用专门的 `smartSplitAffiliations` 函数进行智能处理：
  - 优先按句号分割，保持完整机构名称
  - 过滤掉行政区划（如"北京"、"中国"等）
  - 只保留包含机构关键词的项目（如"大学"、"医院"、"研究所"等）
  - 自动清理引号、括号等特殊字符

### 3. 展开/收起功能
为了避免标签过多影响界面美观，添加了展开/收起功能：

- **关键词**: 默认显示前15个，超过时显示"显示更多"按钮
- **作者信息**: 默认显示前10个，超过时显示"显示更多"按钮  
- **机构信息**: 默认显示前8个，超过时显示"显示更多"按钮

### 4. 视觉优化
每种信息类型使用不同的颜色主题：

- **关键词**: 绿色主题 (`bg-green-100 text-green-800`)
- **作者信息**: 紫色主题 (`bg-purple-100 text-purple-800`)
- **机构信息**: 橙色主题 (`bg-orange-100 text-orange-800`)

### 5. 状态管理
添加了状态管理来控制每个部分的展开/收起状态，并在选择新论文时自动重置状态。

## 技术实现

### 核心函数

```typescript
// 智能分割文本的函数
const smartSplit = (text: string, type: 'keywords' | 'authors' | 'affils') => {
  if (!text) return [];
  
  let splitPattern;
  switch (type) {
    case 'keywords':
      splitPattern = /[,;，；\n\r]+/;
      break;
    case 'authors':
      splitPattern = /[,;，；\n\r]|\s+and\s+/i;
      break;
    case 'affils':
      // 机构信息需要特殊处理
      return smartSplitAffiliations(text);
    default:
      splitPattern = /[,;，；\n\r]+/;
  }
  
  return text
    .split(splitPattern)
    .map(item => item.trim())
    .filter(item => item.length > 0 && item !== '.' && item !== ',');
};

// 智能分割机构信息的专用函数
const smartSplitAffiliations = (text: string) => {
  if (!text) return [];
  
  // 需要过滤的行政区划和通用地名
  const administrativeRegions = new Set([
    '北京', '上海', '天津', '重庆', '广州', '深圳', '杭州', '南京', '武汉', '成都',
    '广东', '浙江', '江苏', '山东', '河南', '湖北', '湖南', '四川', '福建', '安徽',
    'China', 'USA', 'UK', 'Japan', 'Korea', 'Germany', 'France', 'Italy',
    '中国', '美国', '英国', '日本', '韩国', '德国', '法国', '意大利',
    // ... 更多行政区划
  ]);
  
  // 首先按照句号分割，保持完整机构名称
  let items = text.split(/[\.。]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  // 如果句号分割后只有一个项目，尝试用逗号分割
  if (items.length === 1) {
    items = text.split(/[,，]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }
  
  // 过滤掉行政区划和无效项目，只保留真正的机构信息
  return items.filter(item => {
    const cleanItem = item.replace(/^['"`\[\(]+|['"`\]\)]+$/g, '').trim();
    
    // 过滤条件：长度、数字、行政区划、标点符号
    if (cleanItem.length < 3 || /^\d+$/.test(cleanItem) || 
        administrativeRegions.has(cleanItem) || 
        /^[^\w\u4e00-\u9fff]+$/.test(cleanItem)) {
      return false;
    }
    
    // 只保留包含机构关键词的项目
    const institutionKeywords = [
      'University', 'Hospital', 'Institute', 'College', 'School', 'Department',
      '大学', '医院', '学院', '研究所', '研究院', '中心', '科室', '实验室',
      '附属', '第一', '第二', '第三', '第四', '第五', '人民', '中医', '西医',
      '综合', '专科', '妇幼', '儿童', '肿瘤', '心血管', '神经', '放射', '影像'
    ];
    
    return institutionKeywords.some(keyword => 
      cleanItem.toLowerCase().includes(keyword.toLowerCase())
    );
  }).map(item => item.replace(/^['"`\[\(]+|['"`\]\)]+$/g, '').trim());
};
```

### 状态管理

```typescript
const [showAllKeywords, setShowAllKeywords] = useState(false);
const [showAllAuthors, setShowAllAuthors] = useState(false);
const [showAllAffils, setShowAllAffils] = useState(false);
```

## 用户体验改进

1. **更清晰的信息展示**: 每个关键词、作者和机构都作为独立的标签显示，便于快速浏览
2. **更好的可读性**: 不同颜色的标签帮助用户区分不同类型的信息
3. **节省空间**: 默认只显示重要信息，需要时可以展开查看全部
4. **交互友好**: 点击按钮即可展开/收起，操作简单直观
5. **智能过滤**: 机构信息自动过滤掉无用的行政区划，只显示有意义的机构名称
6. **完整性保持**: 机构名称作为完整的标签显示，如"中山大学第五附属医院放射科"不会被拆分

## 兼容性

- ✅ 与现有的 Tailwind CSS 配置完全兼容
- ✅ 与 shadcn/ui 组件库完全兼容
- ✅ 支持响应式设计
- ✅ 保持了原有的功能不变

## 测试建议

1. 打开论文详情页
2. 检查关键词、作者和机构信息是否正确显示为标签形式
3. 测试展开/收起功能是否正常工作
4. 验证不同论文的信息显示是否正确
5. 检查在移动端的显示效果 