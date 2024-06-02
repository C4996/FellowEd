<script setup lang="ts">
import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
// import { ref } from 'vue';

const props = defineProps({
    msg: {
        type: Object,
        required: true
    }
});

const renderMarkdown = (markdownText) => {
    const md = new markdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        // 此处判断是否有添加代码语言
      if (lang && hljs.getLanguage(lang)) {
        try {
            // 得到经过highlight.js之后的html代码
          const preCode = hljs.highlight(str, { language: lang }, true).value
          // 以换行进行分割
          const lines = preCode.split(/\n/).slice(0, -1)
          // 添加自定义行号
          let html = lines.map((item, index) => {
            return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
          }).join('')
          html = '<ol>' + html + '</ol>'
          // 添加代码语言
          if (lines.length) {
            html += '<b class="name">' + lang + '</b>'
          }
          return '<pre class="hljs"><code>' +
            html +
            '</code></pre>'
        } catch (__) {}
      }
      // 未添加代码语言，此处与上面同理
      const preCode = md.utils.escapeHtml(str)
      const lines = preCode.split(/\n/).slice(0, -1)
      let html = lines.map((item, index) => {
        return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item + '</li>'
      }).join('')
      html = '<ol>' + html + '</ol>'
      return '<pre class="hljs"><code>' +
        html +
        '</code></pre>'
    }
  })
    return md.render(markdownText);
}

</script>


<template>
    <p>Hallo</p>
    <p>{{ props.msg.user }}</p>
    <!-- <p>{{ props.msg.text }}</p> -->
    <div v-html="renderMarkdown(props.msg.text)"></div>
    <br />
</template>

<style>

</style>