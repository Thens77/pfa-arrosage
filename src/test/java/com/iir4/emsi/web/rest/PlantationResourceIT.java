package com.iir4.emsi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iir4.emsi.IntegrationTest;
import com.iir4.emsi.domain.Plantation;
import com.iir4.emsi.repository.PlantationRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PlantationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlantationResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_NBR_PLANTE = 1;
    private static final Integer UPDATED_NBR_PLANTE = 2;

    private static final String ENTITY_API_URL = "/api/plantations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlantationRepository plantationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlantationMockMvc;

    private Plantation plantation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plantation createEntity(EntityManager em) {
        Plantation plantation = new Plantation().date(DEFAULT_DATE).nbrPlante(DEFAULT_NBR_PLANTE);
        return plantation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plantation createUpdatedEntity(EntityManager em) {
        Plantation plantation = new Plantation().date(UPDATED_DATE).nbrPlante(UPDATED_NBR_PLANTE);
        return plantation;
    }

    @BeforeEach
    public void initTest() {
        plantation = createEntity(em);
    }

    @Test
    @Transactional
    void createPlantation() throws Exception {
        int databaseSizeBeforeCreate = plantationRepository.findAll().size();
        // Create the Plantation
        restPlantationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plantation)))
            .andExpect(status().isCreated());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeCreate + 1);
        Plantation testPlantation = plantationList.get(plantationList.size() - 1);
        assertThat(testPlantation.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPlantation.getNbrPlante()).isEqualTo(DEFAULT_NBR_PLANTE);
    }

    @Test
    @Transactional
    void createPlantationWithExistingId() throws Exception {
        // Create the Plantation with an existing ID
        plantation.setId(1L);

        int databaseSizeBeforeCreate = plantationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlantationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plantation)))
            .andExpect(status().isBadRequest());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlantations() throws Exception {
        // Initialize the database
        plantationRepository.saveAndFlush(plantation);

        // Get all the plantationList
        restPlantationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plantation.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].nbrPlante").value(hasItem(DEFAULT_NBR_PLANTE)));
    }

    @Test
    @Transactional
    void getPlantation() throws Exception {
        // Initialize the database
        plantationRepository.saveAndFlush(plantation);

        // Get the plantation
        restPlantationMockMvc
            .perform(get(ENTITY_API_URL_ID, plantation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plantation.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.nbrPlante").value(DEFAULT_NBR_PLANTE));
    }

    @Test
    @Transactional
    void getNonExistingPlantation() throws Exception {
        // Get the plantation
        restPlantationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPlantation() throws Exception {
        // Initialize the database
        plantationRepository.saveAndFlush(plantation);

        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();

        // Update the plantation
        Plantation updatedPlantation = plantationRepository.findById(plantation.getId()).get();
        // Disconnect from session so that the updates on updatedPlantation are not directly saved in db
        em.detach(updatedPlantation);
        updatedPlantation.date(UPDATED_DATE).nbrPlante(UPDATED_NBR_PLANTE);

        restPlantationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlantation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlantation))
            )
            .andExpect(status().isOk());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
        Plantation testPlantation = plantationList.get(plantationList.size() - 1);
        assertThat(testPlantation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPlantation.getNbrPlante()).isEqualTo(UPDATED_NBR_PLANTE);
    }

    @Test
    @Transactional
    void putNonExistingPlantation() throws Exception {
        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();
        plantation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, plantation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plantation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlantation() throws Exception {
        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();
        plantation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plantation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlantation() throws Exception {
        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();
        plantation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plantation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlantationWithPatch() throws Exception {
        // Initialize the database
        plantationRepository.saveAndFlush(plantation);

        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();

        // Update the plantation using partial update
        Plantation partialUpdatedPlantation = new Plantation();
        partialUpdatedPlantation.setId(plantation.getId());

        partialUpdatedPlantation.date(UPDATED_DATE).nbrPlante(UPDATED_NBR_PLANTE);

        restPlantationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlantation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlantation))
            )
            .andExpect(status().isOk());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
        Plantation testPlantation = plantationList.get(plantationList.size() - 1);
        assertThat(testPlantation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPlantation.getNbrPlante()).isEqualTo(UPDATED_NBR_PLANTE);
    }

    @Test
    @Transactional
    void fullUpdatePlantationWithPatch() throws Exception {
        // Initialize the database
        plantationRepository.saveAndFlush(plantation);

        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();

        // Update the plantation using partial update
        Plantation partialUpdatedPlantation = new Plantation();
        partialUpdatedPlantation.setId(plantation.getId());

        partialUpdatedPlantation.date(UPDATED_DATE).nbrPlante(UPDATED_NBR_PLANTE);

        restPlantationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlantation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlantation))
            )
            .andExpect(status().isOk());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
        Plantation testPlantation = plantationList.get(plantationList.size() - 1);
        assertThat(testPlantation.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPlantation.getNbrPlante()).isEqualTo(UPDATED_NBR_PLANTE);
    }

    @Test
    @Transactional
    void patchNonExistingPlantation() throws Exception {
        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();
        plantation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, plantation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plantation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlantation() throws Exception {
        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();
        plantation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plantation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlantation() throws Exception {
        int databaseSizeBeforeUpdate = plantationRepository.findAll().size();
        plantation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(plantation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plantation in the database
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlantation() throws Exception {
        // Initialize the database
        plantationRepository.saveAndFlush(plantation);

        int databaseSizeBeforeDelete = plantationRepository.findAll().size();

        // Delete the plantation
        restPlantationMockMvc
            .perform(delete(ENTITY_API_URL_ID, plantation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Plantation> plantationList = plantationRepository.findAll();
        assertThat(plantationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
