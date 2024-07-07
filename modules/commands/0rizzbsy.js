module.exports.config = {
    name: "rizzbsy",
    version: "1.0.0",
    credits: "YourName",
    description: "Tags someone and rizzes them with a playful message in Bisaya (Visayan).",
    commandCategory: "fun",
    usages: ["!rizz @mention - Rizzes the mentioned person with a playful message."],
    cooldowns: 5,
};

const rizzMessages = [
    "{mention}, ikaw ra gyud ang pahibalo kon unsaon pag-uwag og kalipay sa tawo! 😄",
    "Oy {mention}, ikaw ang WiFi sa kalibutan sa mga koneksyon. Permi reliable og nagpatigbabaw! 📶",
    "{mention}, parang ikaw ang kape nga perfect—nagpainit sa atong adlaw ug naghatag og enerhiya! ☕",
    "Kung ang kinabuhi naghatag og limons, salamat kay naa si {mention} nga maghinayon og lemonade! 🍋🥤",
    "{mention}, kung ang kalipay makuhaan og presyo sa mga ngisi, dako na kaayo ang imong gisul-ob nga ngisi! Magpadayon og pag-ambit og kalipay!",
    "Oy {mention}, ikaw ang magnet sa positibong kahimtang. Salamat sa pag-atrak og daghang kahiusahan sa atong kinabuhi!",
    "{mention}, ikaw ang kasingkasing sa matag party—permi nagpabilin ang kahumot sa tanan ug naghatag og maayo nga panahon!",
    "Kung lisod na ang panahon, si {mention} miuswag gihapon. Ikaw ang kahulogan sa pagpadayon og kusog!",
    "Oy {mention}, ikaw ang bahaghari sa mga adlaw nga mapanganuron—nagdala og kolor ug kahayag diin man ka magpuyo!",
    "{mention}, ikaw ang inspirasyon nga naglakip og pagkamabinuhat ug kahinumdoman. Padayon sa pagpakita og imong kabuotan ug pag-ampo!",
    "{mention}, ikaw ang nanghimo sa kalibutan nga mas maayo pag-ana. Salamat!",
    "Oy {mention}, kung ang pagkadakong hilakon adunay nawong, sa imoha ang nawong! Padayon sa pagpabilin sa imong kahinam ug kaayo!",
    "{mention}, ikaw ang bituin sa tanang bituin. Magpakayab og magpadayon sa pagpaanindog sa langit gamit ang imong kadako sa pagka-wasak!",
    "Kung sa tinuod lang nga kaluoy nato, si {mention} ang nagtapok sa atong huna-huna. Salamat sa imong walay kapuslanang kalinaw!",
    "{mention}, ikaw ang klase sa amigo nga naghimog karaang mga hitabo nga dili matagbaw!",
    "Oy {mention}, ikaw ang adlaw nga gitimaho. Salamat sa imong kahinam ug pirmi andam sa uban!",
    "{mention}, ikaw ang kaban sa kaalam ug kahilak. Salamat sa pagpaambit sa imong kasanag kanato!",
    "Kung ang kinabuhi nagdulom sa ato, si {mention} naglabay sa tanang sinilaban. Dili mahimong masunod!",
    "Oy {mention}, ikaw ang pinaka-importanteng tawo (MVP) sa atong kinabuhi. Salamat sa pagpakusog sa ubos sa ibabaw!",
    "{mention}, ikaw parang usa ka binulan nga bulawan—mamahimong mapayong ilawom sa kahayag sa kagabhion!",
    "{mention}, ikaw ang higot nga nag-ugmad sa atong grupo. Salamat sa pagpakig-uban kanato nga pirmi andam sa dawat!",
    "Oy {mention}, ikaw ang kanhi nga hangin sa kalibutan sa kagubot. Magpadayon sa pagdala og kalinaw ug kalinaw!",
    "{mention}, ikaw ang tinuod nga orihinal—walay lain nga parehas kanimo. Hikapin ang imong kahilwayan!",
    "Kung kinahanglan nato og dakong pagsugod sa positibong panagway, si {mention} ang atong gipadangat. Salamat sa pagka-permanenteng kasanag!",
    "{mention}, ikaw ang kasingkasing sa atong komunidad. Salamat sa pagpadayon sa tanang kaugmaon nga nanimuyo ug nangabuhi!",
    "{mention}, ikaw ang klase sa tawo nga magpahimulos sa kada adlaw nga milabay. Padayon sa pagpamulong og kalipay!",
    "Oy {mention}, kung ang kabuotan usa ka superpower, ikaw ang superhero. Salamat sa paghimo og kalambigitan!",
    "{mention}, ikaw ang rockstar sa matag pagbati sa pulong. Magpadayon sa paglingkawas sa atong kalibutan pinaagi sa imong kadako sa pagka-kamangilabot!",
    "Kung mahitungod sa pagka-dako, si {mention} nagtakda sa gahum nga ginto. Salamat sa pagka-mahitungod!",
    "{mention}, ikaw ang klase sa tawo nga nagpabilin sa atong pagtuo sa maayong mga butang sa kinabuhi. Salamat!"
];

module.exports.run = function({ api, event, args }) {
    const { threadID, senderID, mentions } = event;
    const mention = Object.keys(mentions)[0]; // Get the first mentioned user's ID

    if (!mention) {
        return api.sendMessage("Palihug tag-i og tawo aron i-rizz!", threadID);
    }

    const randomMessage = rizzMessages[Math.floor(Math.random() * rizzMessages.length)];
    const message = randomMessage.replace("{mention}", `[${mention.split("_")[0]}]`);

    api.sendMessage(message, threadID);
};
