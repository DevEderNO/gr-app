import React, { useEffect, useState } from 'react';
import { Image, ScrollView, LogBox } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/logo-header.png';
import SearchInput from '../../components/SearchInput';

import api from '../../services/api';
// import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  FilterContainer,
  Title,
  CategoryContainer,
  CategorySlider,
  CategoryItem,
  CategoryItemTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

export interface IFood {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

export interface ICategory {
  id: number;
  title: string;
  image_url: string;
}

interface ISearch {
  q: string | undefined;
  category: number | undefined;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchValue, setSearchValue] = useState('');

  const navigation = useNavigation();

  async function handleNavigate(id: number): Promise<void> {
    // Navigate do ProductDetails page
    navigation.navigate('FoodDetails', { id });
  }

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const params = {} as ISearch;
      if (searchValue) {
        params.q = searchValue;
      }
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      api.get('/foods', { params }).then(response => {
        setFoods(response.data);
      });
    }

    loadFoods();
  }, [selectedCategory, searchValue]);

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      api.get('/categories').then(response => {
        setCategories(response.data);
      });
    }

    loadCategories();
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  function handleSelectCategory(id: number): void {
    setSelectedCategory(state => (state !== id ? id : undefined));
  }

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Icon
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigation.navigate('Home')}
        />
      </Header>
      <FilterContainer>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <CategoryContainer>
          <Title>Categorias</Title>
          <CategorySlider
            data={categories}
            keyExtractor={category => String(category.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: category }) => (
              <CategoryItem
                key={category.id}
                isSelected={category.id === selectedCategory}
                onPress={() => handleSelectCategory(category.id)}
                activeOpacity={0.6}
                testID={`category-${category.id}`}
              >
                <Image
                  style={{ width: 56, height: 56 }}
                  source={{ uri: category.image_url }}
                />
                <CategoryItemTitle>{category.title}</CategoryItemTitle>
              </CategoryItem>
            )}
          />
        </CategoryContainer>
        <FoodsContainer>
          <Title>Pratos</Title>
          <FoodList
            data={foods}
            keyExtractor={food => String(food.id)}
            ListEmptyComponent={
              <FoodTitle> ¯\_(ツ)_/¯ Nenhum prato encontrado.</FoodTitle>
            }
            renderItem={({ item: food }) => (
              <Food
                onPress={() => handleNavigate(food.id)}
                activeOpacity={0.6}
                testID={`food-${food.id}`}
              >
                <FoodImageContainer>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: food.thumbnail_url }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{food.name}</FoodTitle>
                  <FoodDescription>{food.description}</FoodDescription>
                  <FoodPricing>{food.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            )}
          />
        </FoodsContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
