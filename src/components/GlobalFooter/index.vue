<template>
  <global-footer class="footer custom-render">
    <template v-slot:copyright>
      Copyright &copy; 2023 <a href="https://github.com/collins401/ruoyi-rspack" target="_blank">RuoYi-Rspack</a><br/>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@/components/ProLayout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
