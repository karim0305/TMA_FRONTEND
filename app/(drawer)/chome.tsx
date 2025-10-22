import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");


const sliderData = [
  {
    id: "1",
    image: { uri: "https://couponswala.com/blog/wp-content/uploads/2022/09/combo-offers-for-women.jpg.webp" },
    alt: "Summar offer",
  },
  {
    id: "2",
    image: { uri: "https://packagesmall.com/wp-content/uploads/2024/01/Sapphire-winter-collection-sale-at-Packages-mall-1024x508.jpeg" },
    alt: "Offer 2",
  },
  {
    id: "3",
    image: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" },
    alt: "Offer 3",
  },
];

const categories = [
  { label: "Kids", icon: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" } },
  { label: "Ladies", icon: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" } },
  { label: "Gents", icon: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" } },
  { label: "Accessories", icon: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" } },
];

const brands = [
  { label: "Zelbery", thumb: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" } },
  { label: "Kamalia", thumb: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" } },
  { label: "KidCo", thumb: { uri: "https://cdn.shopify.com/s/files/1/0202/5884/8822/files/K21SW108-RNW-1_1024x1024_1_600x600.jpg?v=1627021040" } },
];

const feedbacks = [
  { customer: "Ahmed Khan", comment: "Very good quality!", time: "2 hours ago" },
  { customer: "Sara Ali", comment: "Loved the colour and stitching.", time: "1 day ago" },
  { customer: "John Doe", comment: "Fast delivery, thanks!", time: "3 days ago" },
];

function SectionCard({
  title,
  onSeeMore,
  children,
}: {
  title: string;
  onSeeMore?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeMore && (
          <TouchableOpacity onPress={onSeeMore}>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

export default function ProductHomePage() {
  const handleSeeMore = (section: string) => {
    Alert.alert(`See More pressed for ${section}`);
  };

  const handleBuy = (brand: string) => {
    Alert.alert(`Buy button pressed for ${brand}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Offers Section */}
      <SectionCard title="" >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
          style={styles.sliderContainer}
        >
          {sliderData.map((item) => (
            <View key={item.id} style={{ width, height: 200 }}>
              <Image source={item.image} style={styles.sliderImage} />
            </View>
          ))}
        </ScrollView>
      </SectionCard>

      {/* Categories Section */}
      <SectionCard title="📦 Categories" onSeeMore={() => handleSeeMore("Categories")}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity key={idx} style={styles.catItem}>
              <Image source={cat.icon} style={styles.catAvatar} />
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SectionCard>

      {/* Brands Section */}
     <SectionCard title="🏷️ Brands" onSeeMore={() => handleSeeMore("Brands")}>
  <View style={styles.brandsGrid}>
    {brands.map((brand, idx) => (
      <View key={idx} style={styles.brandItem}>
        <View style={styles.brandImageContainer}>
          <Image source={brand.thumb} style={styles.brandThumb} />
          <View style={styles.brandOverlay}>
            <Text style={styles.brandLabel}>{brand.label}</Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleBuy(brand.label)}
            >
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ))}
  </View>
</SectionCard>


      {/* Customer Feedback Section */}
      <SectionCard title="💬 Customer Feedback" onSeeMore={() => handleSeeMore("Customer Feedback")}>
        <View style={styles.feedbackSection}>
          {feedbacks.map((fb, idx) => (
            <View key={idx} style={styles.feedbackItem}>
              <Text style={styles.feedbackCustomer}>{fb.customer}</Text>
              <Text style={styles.feedbackComment}>{fb.comment}</Text>
              <Text style={styles.feedbackTime}>{fb.time}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5, // for Android shadow
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  seeMore: {
    fontSize: 14,
    color: "#2563eb", // blue color for link
    fontWeight: "600",
  },

  sliderContainer: {
    height: 200,
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  categoriesScroll: {
    paddingHorizontal: 4,
  },
  catItem: {
    alignItems: "center",
    marginRight: 12,
  },
  catAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  catLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },

  brandsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  brandItem: {
    width: "48%",
    marginBottom: 12,
  },
  brandThumb: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 12,
  },
  brandRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

 

  feedbackSection: {
    marginBottom: 0,
  },
  feedbackItem: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  feedbackCustomer: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  feedbackTime: {
    fontSize: 12,
    color: "#6b7280",
  },





brandImageContainer: {
  position: "relative",
  width: "100%",
  height: 200,
  borderRadius: 12,
  overflow: "hidden",  // clip children to container
},

brandOverlay: {
  position: "absolute",
  bottom: 10,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 12,
  backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent dark bg for contrast
  zIndex: 10,
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
},

buyButton: {
  backgroundColor: "#3b82f6",
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 6,
},

buyButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
},

brandLabel: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#fff",
},

});
