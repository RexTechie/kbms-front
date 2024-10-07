<template>
  
    <div class="container">
    <h1 class="doc_title">标题：{{ docData.title }}</h1>
    <div>
      <div class="doc_summary">摘要：{{ docData.summary }}</div>
      <div class="doc_info">{{ docData.createTime }} · {{ docData.owner }}</div>
    </div>
    <div class="doc_context" v-html="docData.contentHtml"></div>
  </div>
</template>

<script>
export default{
  data(){
    return {
      projId: null,
      docData: {
        id: 1,
        title: "课程评估系统",
        description: "这是一个课程评估系统...",
        contentHtml: "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, cupiditate. Veniam mollitia illum sapiente necessitatibus eum saepe assumenda, minus fugiat explicabo adipisci sunt dicta atque deleniti neque esse impedit! Neque, perspiciatis tempore. Quas, ut! Cupiditate enim sunt voluptatem quibusdam obcaecati, reiciendis tenetur repudiandae iusto hic natus sint, consequatur, dicta harum unde suscipit sapiente? Eveniet, distinctio nobis labore magnam quas unde repellendus veritatis natus sunt ipsam hic cupiditate dignissimos est harum iure provident fugit voluptas dolore sapiente culpa ipsum expedita perferendis molestiae. Minima, facere suscipit rem aliquam perferendis neque, atque mollitia perspiciatis veniam, dolore necessitatibus! Laudantium vero dolore officia enim asperiores sint magni officiis veritatis iusto eum voluptatum harum esse saepe sunt facere dolorum commodi, aliquam distinctio eligendi ratione dolor eaque deleniti ex animi. Quas libero eos consectetur eius minus adipisci qui saepe voluptates dolores animi dolor fugit unde et quisquam, voluptatum quaerat perspiciatis? Nesciunt doloribus at similique, eum voluptatum laboriosam unde maiores perspiciatis consectetur nobis. Qui rem animi facere eveniet, laborum officia aliquid ad maxime quidem error tenetur eos beatae, cupiditate accusantium vel mollitia ducimus repudiandae tempora asperiores minus! A facere vero tempore assumenda voluptates ullam aliquid eius impedit rerum quidem hic placeat, doloribus quas laboriosam sunt expedita aspernatur accusantium quisquam tempora ratione temporibus obcaecati adipisci quod. Sapiente nesciunt eaque quas atque ut porro deleniti repellat alias, dignissimos suscipit ullam dolores quibusdam qui, dolore quasi eveniet fuga voluptas reiciendis nisi provident itaque in cupiditate eos! Consequuntur, voluptates! Dignissimos cum eaque beatae assumenda quia obcaecati, accusamus minima mollitia nulla numquam minus! Deserunt velit, dicta magni doloribus ab illum nemo quidem blanditiis modi aperiam odio omnis consequuntur sapiente voluptatum. Repellat aut dignissimos animi ut quas odio perspiciatis? Fugiat corporis pariatur eum beatae deserunt molestiae atque, sequi asperiores itaque dolores vitae ducimus aut dolorem consequuntur, perferendis optio architecto animi doloremque quasi nesciunt voluptate iste veniam odio. Corporis explicabo tempore unde quos id numquam aspernatur maxime minus nesciunt! Facilis commodi laudantium repudiandae molestias est voluptatem tempora optio deserunt culpa, recusandae dicta eius ipsa sint quidem impedit. Libero, expedita esse laboriosam nulla, vero a corrupti itaque corporis, reprehenderit quo ducimus? Voluptatem maiores, officiis molestiae animi iste repudiandae molestias aut exercitationem ratione dolore. Reprehenderit iure quisquam ut quaerat quae expedita magni, numquam, dolorem repellendus reiciendis at quam et eaque ducimus quasi. Repellendus natus accusamus quo? Blanditiis exercitationem, quis corrupti corporis cumque nisi nihil non voluptate! Aspernatur saepe voluptas inventore, illum, alias incidunt quia recusandae pariatur est sint quae asperiores possimus totam porro debitis. Autem neque, ea itaque ullam similique quas esse voluptate nulla molestiae nihil recusandae tenetur at voluptatum beatae, blanditiis quidem aspernatur optio architecto. Distinctio similique dolor hic aperiam magni necessitatibus natus consequuntur expedita minus fugiat voluptatibus, maiores cumque doloribus veritatis reiciendis adipisci ducimus reprehenderit! Accusantium vitae nihil quos doloribus. Accusantium, modi fugit! Optio sequi sapiente saepe. Ex aliquam vitae voluptate nesciunt cumque nostrum odit voluptas ut fugit perspiciatis distinctio maiores omnis tenetur unde laborum, voluptatem exercitationem veritatis impedit sit. Dolorem molestias rerum, voluptas earum suscipit recusandae inventore dolorum libero mollitia aliquid sed a ex, rem minus nesciunt animi, perspiciatis asperiores ab consequuntur fugiat reiciendis voluptate necessitatibus. Repellendus libero consequatur, eum, mollitia enim quia deleniti minima dignissimos autem dolore blanditiis laborum odio. Eaque tempora perspiciatis iste quibusdam soluta voluptatum excepturi, quos asperiores laudantium nemo nam illo repellat dolorem tenetur modi vero facere commodi atque est accusamus nostrum dicta quia possimus doloribus! Sint eius, quod quisquam quae quas illum provident labore libero laborum at dolorum id sed ipsam expedita ratione obcaecati nesciunt qui earum error numquam eos. Doloremque in voluptate nemo repudiandae ea fugit quam fuga, saepe dicta tempora corrupti maxime consectetur tempore aut soluta eum similique dolor, inventore reiciendis harum ab! Rerum provident inventore eum voluptates, sunt quos aperiam aspernatur, quia laudantium dignissimos laboriosam non reiciendis, quisquam maiores. Earum quaerat laboriosam amet mollitia adipisci voluptates dignissimos qui maiores cum pariatur ea explicabo eius sed culpa quibusdam, facilis quos quo nam molestias labore consequuntur ad nulla? Eligendi deserunt magni nobis, error quibusdam ipsum labore perferendis totam cupiditate aperiam nisi quisquam repudiandae harum autem excepturi reiciendis ad amet ab nulla. Accusamus, adipisci ut? Voluptates, doloribus placeat molestiae rem error repellendus laborum. Commodi accusantium beatae distinctio sunt neque blanditiis laboriosam id exercitationem non, unde, ab minus impedit laudantium ipsa, recusandae provident. Modi, molestiae nulla corporis magnam, saepe neque consequuntur voluptatem commodi voluptatibus dignissimos et harum distinctio nihil illo minima ea odio repudiandae ducimus cumque fugit dicta. Repellat quas nostrum debitis distinctio maxime. Nesciunt nam laboriosam laborum, architecto eius saepe cupiditate, excepturi vitae iusto tempora illum facilis? Dolore ut vitae voluptatem consequatur! Alias id facilis, repudiandae facere aut inventore fuga nisi sint delectus! Dicta dignissimos, iusto esse mollitia quo, atque possimus reiciendis, quas autem eligendi incidunt? Recusandae corporis repudiandae ex aperiam et quo vero nobis dicta distinctio placeat magni praesentium, tempore cupiditate quas? Iusto dolores nobis quas commodi nisi alias veniam incidunt perferendis. Quae cumque quibusdam impedit consectetur libero, fuga, perferendis quas, ea illo quasi sequi quidem nihil rem dolorum! Voluptatum suscipit ullam sequi quo incidunt sit corporis et repellendus? Praesentium facere blanditiis veniam, sint tempore ex enim, aliquid aperiam placeat eaque culpa saepe pariatur provident labore quisquam minus. Accusantium nam eius dicta possimus saepe repudiandae excepturi reprehenderit. Quod neque delectus voluptas pariatur quibusdam, corrupti deserunt saepe labore, natus nisi provident expedita! Enim nisi deserunt distinctio eveniet nostrum quo unde ipsum! Dolore fugiat sed praesentium quisquam blanditiis voluptas maxime, ratione, laboriosam ducimus itaque quaerat. Quas consequuntur tenetur fugiat cum, facere commodi rem velit maiores numquam laboriosam expedita excepturi iste, rerum voluptatem! Rem nesciunt magnam laborum in, quaerat quod expedita quas beatae ratione, nihil tenetur. Incidunt impedit accusamus nesciunt possimus nobis laboriosam deleniti ut officiis ea cupiditate eaque delectus non illum, repellat perferendis nihil dolorum saepe blanditiis velit. Eligendi, exercitationem ut quod facere voluptatibus similique consequuntur repudiandae eaque eum rem. Iusto temporibus ullam distinctio eius excepturi facere possimus? Officia vero sunt incidunt, vitae soluta nulla laudantium pariatur aut. In, deleniti aliquid. Obcaecati itaque aut ipsa repellendus explicabo molestias at maxime officiis recusandae error saepe voluptatum et, quas dolorem libero? Ipsam!</p>",
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      }
    }
  },
  created(){
    let id = this.$route.params.docId
    let projId = this.$route.params.id
    this.docData.id = id;
    let that = this;
    that.$nextTick(() => {
      // 加载数据
      if (id !== null){
        that.$http(`/proj/doc/${id}`,
            "GET", null, false, (resp) => {
              if (resp.code === 200) {
                that.docData.title = resp.data.title;
                that.docData.summary = resp.data.summary;
                that.docData.owner = resp.data.owner;
                that.docData.contentHtml = resp.data.contentHtml;
                that.docData.contentText = resp.data.contentText;
              } else {
                that.$message({message: "文章不存在", type: "error", duration: 1200});
              }
            }
        )
      }
    })
  }
}
</script>
<style scoped="less">
.container{
  padding: 20px 80px;
  div{
    margin-top: 10px;
  }
  .doc_title{
    padding: 20px 10px;
    margin: 0;
    background-color: #b8e0ff;
    border: 1px solid #efefef;
    border-left: 5px solid #25a1ff;
    border-radius: 5px;
  }
  .doc_summary{
    padding:10px 10px;
    background-color: #ffd1d1;
    border: 1px solid #efefef;
    border-left: 5px solid #ff3e3e;
    border-radius: 5px;
  }
  .doc_info{
    padding:10px 10px;
    line-height: 30px;
    background-color: #f8f8f8;
    border: 1px solid #efefef;
    border-radius: 5px;
    border-left: 5px solid #7a7979;
    color: #999AA9;
  }

  .doc_context{
    padding: 0px 10px;
    min-height: 50vh;
    border: 1px solid #efefef;
    border-radius: 5px;
  }
}
</style>