/**
 * Created by dmkits on 30.12.16.
 */
define(["dialogs"],
    function(dialogs) {
        return {
            /**
             * params = { prodTagsContentData, pageProdTagType,
              *     priceItemName }
             */
            openPagePrintProductsTags: function (params) {
                if(!params) return;
                var printWindow= window.open("/print/printTags");
                printWindow["prodTagsContentData"]= params.prodTagsContentData;
                printWindow["pageProdTagType"]= params.pageProdTagType;
                printWindow["prodTagsContentPriceItemName"]= params.priceItemName;
            }
        };
    });